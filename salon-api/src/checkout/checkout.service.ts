import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

import {
  Facturation,
  FacturationStatus,
} from '../facturations/entities/facturation.entity';
import { Vente } from '../ventes/entities/vente.entity';
import { VenteProduit } from '../vente-produits/entities/vente-produit.entity';
import { ProduitUnite } from '../produits/entities/produit_unites.entity';
import { CashRegister } from '../cash-register/entities/cash_registers.entity';
import { AuditLogService } from '../audit-log/audit-log.service';
import { CheckoutPosDto } from './dto/checkout-pos.dto';
import { ModePaiement, Paiement } from 'src/paiements/entities/paiement.entity';
import { StockConsumptionService } from 'src/stocks/stock-consumption.service';
import { Prestation } from 'src/prestations/entities/prestation.entity';
import {
  CashMovement,
  CashMovementDirection,
  CashMovementType,
} from 'src/cash-movements/entities/cash-movement.entity';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly auditLogService: AuditLogService,
    private readonly stockConsumptionService: StockConsumptionService,
  ) {}

  // =========================
  // CHECKOUT FACTURE → VENTE
  // =========================
  async checkoutFacture(factureId: number, userId: number, username: string) {
    const qr = this.dataSource.createQueryRunner();

    await qr.connect();
    await qr.startTransaction();

    const manager: EntityManager = qr.manager;

    try {
      // 1. LOCK FACTURE
      const facture = await manager.findOne(Facturation, {
        where: { id: factureId },
        relations: {
          items: {
            produitUnite: true,
          },
          client: true,
          reservation: true,
          vente: true,
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (!facture) {
        throw new NotFoundException('Facture introuvable');
      }

      // 2. CHECK STATUT + LOCK LOGIQUE
      // 🔥 Protection 1 facture = 1 vente
      console.log(facture);
      if (facture.vente) {
        return facture.vente;
      }

      if (facture.isLocked) {
        throw new ConflictException('Facture déjà traitée');
      }

      if (facture.status === FacturationStatus.PAID) {
        throw new ConflictException('Facture déjà payée');
      }

      if (facture.status === FacturationStatus.CANCELLED) {
        throw new ConflictException('Facture annulée');
      }

      // if (!facture.paymentReference) {
      //   throw new ConflictException('Payment reference requise');
      // }

      // const alreadyProcessed = await manager.findOne(Facturation, {
      //   where: { paymentReference: facture.paymentReference },
      // });

      // if (alreadyProcessed?.status === FacturationStatus.PAID) {
      //   throw new ConflictException('Transaction déjà traitée (idempotence)');
      // }

      // 3. CHECK CAISSE
      if (!facture.client) {
        throw new NotFoundException('Client introuvable');
      }

      const cashRegister = await manager.findOne(CashRegister, {
        where: {
          status: 'OPEN',
        },
        lock: { mode: 'pessimistic_write' },
      });

      if (!cashRegister) {
        throw new ConflictException('Aucune caisse ouverte');
      }

      // 4. STOCK + CALCUL
      // 4. STOCK + CALCUL
      let totalProduits = 0;
      let totalPrestations = 0;

      const itemsToCreate: Partial<VenteProduit>[] = [];

      for (const item of facture.items) {
        const lineTotal = Number(item.prix) * Number(item.quantite);

        // =========================
        // PRODUIT
        // =========================
        if (item.produitUnite) {
          const produitUnite = await manager.findOne(ProduitUnite, {
            where: {
              id: item.produitUnite.id,
            },
            lock: {
              mode: 'pessimistic_write',
            },
          });

          if (!produitUnite) {
            throw new NotFoundException('Produit introuvable');
          }

          if (produitUnite.stock < item.quantite) {
            throw new ConflictException(
              `Stock insuffisant pour ${produitUnite.nom}`,
            );
          }

          produitUnite.stock -= item.quantite;

          await manager.save(ProduitUnite, produitUnite);

          totalProduits += lineTotal;
        }

        // =========================
        // PRESTATION
        // =========================
        if (item.prestation) {
          totalPrestations += lineTotal;
        }

        itemsToCreate.push({
          prestation: item.prestation ?? undefined,
          produitUnite: item.produitUnite ?? undefined,
          label: item.label,
          quantite: item.quantite,
          prix: item.prix,
          total: lineTotal,
        });
      }

      // 5. CREATE VENTE
      const vente = manager.create(Vente, {
        reservation: facture.reservation,
        facture,
        total: Number(facture.total),
        total_prestations: totalPrestations,
        total_produits: totalProduits,
        remise: 0,
        cashRegister,
      });

      const savedVente = await manager.save(Vente, vente);

      // 6. CREATE VENTE PRODUITS
      for (const item of itemsToCreate) {
        await manager.save(VenteProduit, {
          vente: savedVente,
          ...item,
        });
      }

      // 7. UPDATE FACTURE
      facture.status = FacturationStatus.PAID;
      facture.isLocked = true;

      await manager.save(Facturation, facture);

      // 8. UPDATE CASH REGISTER
      cashRegister.totalCash =
        Number(cashRegister.totalCash) + Number(savedVente.total);

      await manager.save(CashRegister, cashRegister);

      // 9. COMMIT
      await qr.commitTransaction();

      await this.auditLogService.log({
        action: 'CHECKOUT',
        entity: 'FACTURE',
        entityId: facture.id,
        userId,
        username,
        payload: {
          total: facture.total,
        },
      });

      return savedVente;
    } catch (error) {
      await qr.rollbackTransaction();
      throw error;
    } finally {
      await qr.release();
    }
  }

  // =========================
  // CANCEL VENTE + RESTORE STOCK
  // =========================
  async cancelVente(venteId: number) {
    const qr = this.dataSource.createQueryRunner();

    await qr.connect();
    await qr.startTransaction();

    const manager: EntityManager = qr.manager;

    try {
      // 1. LOCK VENTE
      const vente = await manager.findOne(Vente, {
        where: {
          id: venteId,
        },

        relations: {
          produits: {
            produitUnite: true,
            prestation: true,
          },

          facturation: true,

          cashRegister: true,

          paiements: true,
        },

        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (!vente) {
        throw new NotFoundException('Vente introuvable');
      }

      // 2. DEJA ANNULEE
      if (vente.isCancelled) {
        throw new ConflictException('Vente déjà annulée');
      }

      // 3. RESTAURATION STOCK
      for (const item of vente.produits) {
        if (!item.produitUnite) {
          continue;
        }

        const unit = await manager.findOne(ProduitUnite, {
          where: {
            id: item.produitUnite.id,
          },

          lock: {
            mode: 'pessimistic_write',
          },
        });

        if (!unit) {
          throw new NotFoundException('Produit introuvable');
        }

        unit.stock = Number(unit.stock) + Number(item.quantite);

        await manager.save(ProduitUnite, unit);
      }

      // 4. ANNULATION VENTE
      vente.isCancelled = true;

      vente.cancelledAt = new Date();

      await manager.save(Vente, vente);

      // 5. ANNULATION FACTURE
      if (vente.facturation) {
        vente.facturation.status = FacturationStatus.CANCELLED;

        vente.facturation.isLocked = true;

        await manager.save(Facturation, vente.facturation);
      }

      // 6. AJUSTEMENT CAISSE + JOURNAL
      if (vente.cashRegister) {
        for (const paiement of vente.paiements ?? []) {
          const montant = Number(paiement.montant);

          switch (paiement.mode) {
            case ModePaiement.ESPECES:
              vente.cashRegister.totalCash =
                Number(vente.cashRegister.totalCash) - montant;

              break;

            case ModePaiement.CARTE:
              vente.cashRegister.totalCard =
                Number(vente.cashRegister.totalCard) - montant;

              break;

            case ModePaiement.MVOLA:
            case ModePaiement.AIRTEL_MONEY:
            case ModePaiement.ORANGE_MONEY:
              vente.cashRegister.totalMobileMoney =
                Number(vente.cashRegister.totalMobileMoney) - montant;

              break;
          }

          // Journal caisse
          await manager.save(CashMovement, {
            cashRegister: vente.cashRegister,

            type: CashMovementType.REFUND,

            direction: CashMovementDirection.OUT,

            amount: montant,

            label: `Annulation vente #${vente.id}`,

            reference: `REFUND-${vente.id}`,
          });
        }

        await manager.save(CashRegister, vente.cashRegister);
      }

      // 7. COMMIT
      await qr.commitTransaction();

      return {
        success: true,

        message:
          'Vente annulée, stock restauré, caisse ajustée et journal mis à jour',
      };
    } catch (error) {
      await qr.rollbackTransaction();

      throw error;
    } finally {
      await qr.release();
    }
  }

  async checkoutPos(dto: CheckoutPosDto, userId: number, username: string) {
    const qr = this.dataSource.createQueryRunner();

    await qr.connect();
    await qr.startTransaction();

    const manager = qr.manager;

    try {
      const cashRegister = await manager.findOne(CashRegister, {
        where: { status: 'OPEN' },
        lock: { mode: 'pessimistic_write' },
      });

      if (!cashRegister) throw new ConflictException('Aucune caisse ouverte');

      if (!dto.paiement?.modePaiement) {
        throw new ConflictException('Mode paiement obligatoire');
      }

      let vente: Vente;
      let facture: Facturation | null = null;

      if (dto.factureId) {
        facture = await manager.findOne(Facturation, {
          where: { id: dto.factureId },
          relations: { vente: true, reservation: { client: true } },
          lock: { mode: 'pessimistic_write' },
        });

        if (!facture) {
          throw new NotFoundException('Facture introuvable');
        }

        if (facture.vente && facture.vente.id !== dto.venteId) {
          throw new ConflictException('Cette facture a déjà été encaissée');
        }
      }

      if (dto.venteId) {
        const existing = await manager.findOne(Vente, {
          where: { id: dto.venteId },
          relations: {
            produits: {
              produitUnite: true,
              prestation: true,
            },
            facturation: true,
          },
          lock: { mode: 'pessimistic_write' },
        });

        if (!existing) {
          throw new NotFoundException('Vente introuvable');
        }

        vente = existing;

        await this.stockConsumptionService.restoreFromVente(manager, vente);

        await manager
          .createQueryBuilder()
          .delete()
          .from(VenteProduit)
          .where('venteId = :venteId', { venteId: dto.venteId })
          .execute();
      } else {
        vente = manager.create(Vente);
      }

      let totalProduits = 0;
      let totalPrestations = 0;

      const items: Partial<VenteProduit>[] = [];

      for (const item of dto.items) {
        const prix = Number(item.prix ?? 0);
        const quantite = Number(item.quantite ?? 0);
        const total = prix * quantite;

        if (Number.isNaN(total)) {
          throw new ConflictException(`Prix invalide ${item.label}`);
        }

        if (item.produitUnite) totalProduits += total;
        if (item.prestation) totalPrestations += total;

        items.push({
          label: item.label,
          quantite,
          prix,
          total,
          produitUnite: item.produitUnite
            ? ({ id: item.produitUnite.id } as ProduitUnite)
            : undefined,
          prestation: item.prestation
            ? ({ id: item.prestation.id } as Prestation)
            : undefined,
        });
      }

      const totalFinal = Number(dto.total) - Number(dto.remise ?? 0);

      const montantPaiement = Number(
        dto.paiement.montantrecu ?? dto.paiement.montant ?? 0,
      );

      vente.total = totalFinal;
      vente.total_produits = totalProduits;
      vente.total_prestations = totalPrestations;
      vente.remise = Number(dto.remise ?? 0);
      vente.montantPaye = Number(vente.montantPaye ?? 0) + montantPaiement;
      vente.cashRegister = cashRegister;

      if (facture) {
        vente.facturation = facture;

        vente.reservation = facture.reservation;

        vente.client = facture.reservation?.client;
      }

      const saved = await manager.save(Vente, vente);

      await this.stockConsumptionService.decreaseFromItems(
        manager,
        saved.id,
        items,
      );

      for (const item of items) {
        await manager.save(VenteProduit, {
          vente: saved,
          ...item,
        });
      }

      await manager.save(Paiement, {
        vente: saved,
        modePaiement: dto.paiement.modePaiement,
        montant: montantPaiement,
        montantrecu: montantPaiement,
        montantrendu: dto.paiement.montantrendu ?? 0,
        reference: dto.paiement.referencePaiement,
        telephone: dto.paiement.numeroPaiement,
      });

      if (facture) {
        if (Number(saved.montantPaye) >= Number(saved.total)) {
          facture.status = FacturationStatus.PAID;
          facture.isLocked = true;
          facture.processedAt = new Date();
        }

        await manager.save(Facturation, facture);
      }

      // cashRegister.totalCash = Number(cashRegister.totalCash) + montantPaiement;
      switch (dto.paiement.modePaiement) {
        case ModePaiement.ESPECES:
          cashRegister.totalCash =
            Number(cashRegister.totalCash) + montantPaiement;

          break;

        case ModePaiement.CARTE:
          cashRegister.totalCard =
            Number(cashRegister.totalCard) + montantPaiement;

          break;

        case ModePaiement.MVOLA:
        case ModePaiement.AIRTEL_MONEY:
        case ModePaiement.ORANGE_MONEY:
          cashRegister.totalMobileMoney =
            Number(cashRegister.totalMobileMoney) + montantPaiement;

          break;
      }

      await manager.save(CashRegister, cashRegister);

      // Journal caisse
      await this.createCashMovement(
        manager,
        cashRegister,
        dto.paiement.modePaiement,
        montantPaiement,
        saved.id,
      );

      await qr.commitTransaction();

      await this.auditLogService.log({
        action: 'CHECKOUT_POS',
        entity: 'VENTE',
        entityId: saved.id,
        userId,
        username,
        payload: {
          venteId: saved.id,
          factureId: facture?.id ?? null,
          montantPaiement,
        },
      });

      return {
        ...saved,
        reste: Math.max(
          Number(saved.total) - Number(saved.montantPaye ?? 0),
          0,
        ),
      };
    } catch (error) {
      await qr.rollbackTransaction();
      throw error;
    } finally {
      await qr.release();
    }
  }

  private createCashMovement(
    manager: EntityManager,
    cashRegister: CashRegister,
    modePaiement: ModePaiement,
    montant: number,
    venteId: number,
  ) {
    let type: CashMovementType;

    switch (modePaiement) {
      case ModePaiement.ESPECES:
        type = CashMovementType.SALE_CASH;
        break;

      case ModePaiement.CARTE:
        type = CashMovementType.SALE_CARD;
        break;

      case ModePaiement.MVOLA:
      case ModePaiement.AIRTEL_MONEY:
      case ModePaiement.ORANGE_MONEY:
        type = CashMovementType.SALE_MOBILE;
        break;

      default:
        throw new ConflictException(
          `Mode paiement non supporté ${modePaiement}`,
        );
    }

    return manager.save(CashMovement, {
      cashRegister,

      type,

      direction: CashMovementDirection.IN,

      amount: montant,

      label: `Vente #${venteId}`,

      reference: `VENTE-${venteId}`,
    });
  }
}
