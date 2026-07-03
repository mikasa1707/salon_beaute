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

@Injectable()
export class CheckoutService {
  constructor(private readonly dataSource: DataSource) {}

  // =========================
  // CHECKOUT FACTURE → VENTE
  // =========================
  async checkoutFacture(factureId: number) {
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
        },
        lock: { mode: 'pessimistic_write' },
      });

      if (!facture) {
        throw new NotFoundException('Facture introuvable');
      }

      // 2. CHECK STATUT + LOCK LOGIQUE
      if (facture.isLocked) {
        throw new ConflictException('Facture déjà traitée');
      }

      if (facture.status === FacturationStatus.PAID) {
        throw new ConflictException('Facture déjà payée');
      }

      if (facture.status === FacturationStatus.CANCELLED) {
        throw new ConflictException('Facture annulée');
      }

      if (!facture.paymentReference) {
        throw new ConflictException('Payment reference requise');
      }

      const alreadyProcessed = await manager.findOne(Facturation, {
        where: { paymentReference: facture.paymentReference },
      });

      if (alreadyProcessed?.status === FacturationStatus.PAID) {
        throw new ConflictException('Transaction déjà traitée (idempotence)');
      }

      // 3. CHECK CAISSE
      if (!facture.client) {
        throw new NotFoundException('Client introuvable');
      }

      const cashRegister = await manager.findOne(CashRegister, {
        where: {
          salonId: facture.client.salonId,
          status: 'OPEN',
        },
        lock: { mode: 'pessimistic_write' },
      });

      if (!cashRegister) {
        throw new ConflictException('Aucune caisse ouverte');
      }

      // 4. STOCK + CALCUL
      let totalProduits = 0;
      const itemsToCreate: any[] = [];
      const units: ProduitUnite[] = [];

      for (const item of facture.items) {
        const produitUnite = await manager.findOne(ProduitUnite, {
          where: { id: item.produitUnite.id },
          lock: { mode: 'pessimistic_write' },
        });

        if (!produitUnite) {
          throw new NotFoundException('Produit introuvable');
        }

        if (produitUnite.stock < item.quantite) {
          throw new ConflictException(
            `Stock insuffisant pour ${produitUnite.nom}`,
          );
        }

        units.push(produitUnite);

        const lineTotal = Number(item.prix_unitaire) * Number(item.quantite);

        totalProduits += lineTotal;

        // DECREMENT STOCK
        produitUnite.stock -= item.quantite;
        await manager.save(ProduitUnite, produitUnite);

        itemsToCreate.push({
          produit: item.produitUnite.produit,
          quantite: item.quantite,
          prix_unitaire: item.prix_unitaire,
          total: lineTotal,
        });
      }

      // 5. CREATE VENTE
      const vente = manager.create(Vente, {
        reservation: facture.reservation,
        total: Number(facture.total) + totalProduits,
        total_prestations: Number(facture.total),
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
        where: { id: venteId },
        relations: {
          produits: {
            produit: true,
          },
          reservation: true,
        },
        lock: { mode: 'pessimistic_write' },
      });

      if (!vente) {
        throw new NotFoundException('Vente introuvable');
      }

      // 2. CHECK DEJA CANCEL
      if (vente.isCancelled) {
        throw new ConflictException('Vente déjà annulée');
      }

      // 3. RESTORE STOCK
      for (const item of vente.produits) {
        const unit = await manager.findOne(ProduitUnite, {
          where: {
            produit: { id: item.produit.id },
          },
          lock: { mode: 'pessimistic_write' },
        });

        if (!unit) {
          throw new NotFoundException('Produit introuvable');
        }

        unit.stock += item.quantite;

        await manager.save(ProduitUnite, unit);
      }

      // 4. CANCEL VENTE
      vente.isCancelled = true;
      vente.cancelledAt = new Date();

      await manager.save(Vente, vente);

      // 5. CANCEL FACTURE (SI EXISTE)
      if (vente.reservation) {
        const facture = await manager.findOne(Facturation, {
          where: { reservation: { id: vente.reservation.id } },
          lock: { mode: 'pessimistic_write' },
        });

        if (facture) {
          facture.status = FacturationStatus.CANCELLED;
          await manager.save(Facturation, facture);
        }
      }

      // 6. COMMIT
      await qr.commitTransaction();

      return {
        success: true,
        message: 'Vente annulée + stock restauré',
      };
    } catch (error) {
      await qr.rollbackTransaction();
      throw error;
    } finally {
      await qr.release();
    }
  }
}
