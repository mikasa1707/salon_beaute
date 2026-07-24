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
import { Paiement } from 'src/paiements/entities/paiement.entity';
import { StockConsumptionService } from 'src/stocks/stock-consumption.service';
import { Prestation } from 'src/prestations/entities/prestation.entity';

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
          prix_unitaire: item.prix,
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
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (!vente) {
        throw new NotFoundException('Vente introuvable');
      }

      // 2. CHECK DEJA ANNULEE
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

        unit.stock += Number(item.quantite);
        await manager.save(ProduitUnite, unit);
      }

      // 4. ANNULATION VENTE

      vente.isCancelled = true;
      vente.cancelledAt = new Date();

      await manager.save(Vente, vente);

      // 5. ANNULATION FACTURE LIEE
      if (vente.facturation) {
        vente.facturation.status = FacturationStatus.CANCELLED;
        vente.facturation.isLocked = true;

        await manager.save(Facturation, vente.facturation);
      }
      // 6. AJUSTEMENT CAISSE

      if (vente.cashRegister) {
        vente.cashRegister.totalCash =
          Number(vente.cashRegister.totalCash) - Number(vente.total);

        await manager.save(CashRegister, vente.cashRegister);
      }

      // 7. COMMIT
      await qr.commitTransaction();
      return {
        success: true,

        message: 'Vente annulée, stock restauré et caisse ajustée',
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
        where: {
          status: 'OPEN',
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (!cashRegister) {
        throw new ConflictException('Aucune caisse ouverte');
      }

      if (!dto.paiement?.modePaiement) {
        throw new ConflictException('Mode paiement obligatoire');
      }

      let vente: Vente;

      console.log(dto);

      // =====================================
      // EXISTANTE OU NOUVELLE VENTE
      // =====================================

      if (dto.venteId) {
        const existing = await manager.findOne(Vente, {
          where: {
            id: dto.venteId,
          },
          relations: {
            produits: {
              produitUnite: true,
              prestation: true,
            },
          },
          lock: {
            mode: 'pessimistic_write',
          },
        });

        if (!existing) {
          throw new NotFoundException('Vente introuvable');
        }

        vente = existing;

        // ============================
        // RESTAURATION ANCIEN STOCK
        // ============================

        await this.stockConsumptionService.restoreFromVente(manager, vente);

        // suppression anciennes lignes

        await manager.delete(VenteProduit, {
          vente: {
            id: vente.id,
          },
        });
      } else {
        vente = manager.create(Vente);
      }

      let totalProduits = 0;

      let totalPrestations = 0;

      const items: Partial<VenteProduit>[] = [];

      // =====================================
      // PREPARATION NOUVELLES LIGNES
      // =====================================

      for (const item of dto.items) {
        console.log(item);
        const prix = Number(item.prix_unitaire ?? item.prix_unitaire ?? 0);

        const quantite = Number(item.quantite ?? 0);

        const total = prix * quantite;

        if (Number.isNaN(total)) {
          throw new ConflictException(`Prix invalide ${item.label}`);
        }

        if (item.ProduitUnite) {
          totalProduits += total;
        }

        if (item.prestation) {
          totalPrestations += total;
        }

        items.push({
          label: item.label,

          quantite,

          prix_unitaire: prix,

          total,

          produitUnite: item.ProduitUnite
            ? ({
                id: item.ProduitUnite.id,
              } as ProduitUnite)
            : undefined,

          prestation: item.prestation
            ? ({
                id: item.prestation.id,
              } as Prestation)
            : undefined,
        });
      }

      const totalFinal = Number(dto.total) - Number(dto.remise ?? 0);

      const montantPaiement = Number(
        dto.paiement.montantrecu ?? dto.paiement.montant ?? 0,
      );

      // =====================================
      // UPDATE VENTE
      // =====================================

      vente.total = totalFinal;

      vente.total_produits = totalProduits;

      vente.total_prestations = totalPrestations;

      vente.remise = Number(dto.remise ?? 0);

      // paiement cumulé

      vente.montantPaye = Number(vente.montantPaye ?? 0) + montantPaiement;

      vente.cashRegister = cashRegister;

      const saved = await manager.save(Vente, vente);

      // =====================================
      // NOUVELLE CONSOMMATION STOCK
      // =====================================

      await this.stockConsumptionService.decreaseFromItems(
        manager,
        saved.id,
        items,
      );

      // =====================================
      // NOUVELLES LIGNES
      // =====================================

      for (const item of items) {
        await manager.save(VenteProduit, {
          vente: saved,
          ...item,
        });
      }

      // =====================================
      // NOUVEAU PAIEMENT
      // =====================================

      await manager.save(Paiement, {
        vente: saved,

        modePaiement: dto.paiement.modePaiement,

        montant: montantPaiement,

        montantrecu: montantPaiement,

        montantrendu: dto.paiement.montantrendu ?? 0,

        reference: dto.paiement.referencePaiement,

        telephone: dto.paiement.numeroPaiement,
      });

      // =====================================
      // CAISSE
      // =====================================

      cashRegister.totalCash = Number(cashRegister.totalCash) + montantPaiement;

      await manager.save(CashRegister, cashRegister);

      await qr.commitTransaction();

      await this.auditLogService.log({
        action: 'CHECKOUT_POS',

        entity: 'VENTE',

        entityId: saved.id,

        userId,

        username,

        payload: {
          venteId: saved.id,
          montantPaiement,
        },
      });

      return {
        ...saved,

        reste: Math.max(saved.total - saved.montantPaye, 0),
      };
    } catch (error) {
      await qr.rollbackTransaction();

      throw error;
    } finally {
      await qr.release();
    }
  }
}
