import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';

import {
  Reservation,
  ReservationStatut,
} from '../reservations/entities/reservation.entity';

import { Facturation } from '../facturations/entities/facturation.entity';
import { Produit } from 'src/produits/entities/produit.entity';
import { ProduitUnite } from 'src/produits/entities/produit_unites.entity';
import { Vente } from 'src/ventes/entities/vente.entity';

type StaffStats = {
  personnel: any;
  total_revenue: number;
  reservations_count: number;
};

type PrestaStats = {
  prestation: any;
  count: number;
  revenue: number;
};

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,

    @InjectRepository(Facturation)
    private readonly facturationRepo: Repository<Facturation>,

    @InjectRepository(Produit)
    private readonly produitRepo: Repository<Produit>,

    @InjectRepository(ProduitUnite)
    private readonly uniteRepo: Repository<ProduitUnite>,

    @InjectRepository(Vente)
    private readonly venteRepo: Repository<Vente>,
  ) {}

  private getDayRange(date: Date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  // =========================
  // CA
  // =========================

  async getDailyRevenue(date: Date) {
    const { start, end } = this.getDayRange(date);

    const factures = await this.facturationRepo.find({
      where: {
        created_at: Between(start, end),
      },
    });

    const total = factures.reduce((sum, f) => sum + Number(f.total), 0);

    return {
      date,
      total_revenue: total,
      count: factures.length,
    };
  }

  // =========================
  // RESERVATIONS
  // =========================

  async getReservationStats(date: Date) {
    const { start, end } = this.getDayRange(date);

    const reservations = await this.reservationRepo.find({
      where: {
        date_debut: Between(start, end),
      },
    });

    return {
      total: reservations.length,

      en_attente: reservations.filter(
        (r) => r.statut === ReservationStatut.EN_ATTENTE,
      ).length,

      confirmees: reservations.filter(
        (r) => r.statut === ReservationStatut.CONFIRMEE,
      ).length,

      arrivees: reservations.filter(
        (r) => r.statut === ReservationStatut.ARRIVEE,
      ).length,

      en_cours: reservations.filter(
        (r) => r.statut === ReservationStatut.EN_COURS,
      ).length,

      terminees: reservations.filter(
        (r) => r.statut === ReservationStatut.TERMINEE,
      ).length,

      annulees: reservations.filter(
        (r) => r.statut === ReservationStatut.ANNULEE,
      ).length,
    };
  }

  // =========================
  // PERFORMANCE PERSONNEL
  // =========================

  async getStaffPerformance(date: Date) {
    const { start, end } = this.getDayRange(date);

    const reservations = await this.reservationRepo.find({
      where: {
        date_debut: Between(start, end),
        statut: ReservationStatut.TERMINEE,
      },

      relations: {
        personnels: true,
      },
    });

    const map = new Map<number, StaffStats>();

    for (const reservation of reservations) {
      const revenue = Number(reservation.total_prix ?? 0);

      for (const personnel of reservation.personnels) {
        if (!map.has(personnel.id)) {
          map.set(personnel.id, {
            personnel,
            total_revenue: 0,
            reservations_count: 0,
          });
        }

        const data = map.get(personnel.id);

        if (data) {
          data.total_revenue += revenue;
          data.reservations_count++;
        }
      }
    }

    return Array.from(map.values()).sort(
      (a, b) => b.total_revenue - a.total_revenue,
    );
  }

  // =========================
  // TOP PRESTATIONS
  // =========================

  async getTopPrestations(date: Date) {
    const { start, end } = this.getDayRange(date);

    const reservations = await this.reservationRepo.find({
      where: {
        date_debut: Between(start, end),
        statut: ReservationStatut.TERMINEE,
      },

      relations: {
        prestations: {
          prestation: true,
        },
      },
    });

    const map = new Map<number, PrestaStats>();

    for (const reservation of reservations) {
      for (const item of reservation.prestations) {
        const prestation = item.prestation;

        if (!map.has(prestation.id)) {
          map.set(prestation.id, {
            prestation,
            count: 0,
            revenue: 0,
          });
        }

        const data = map.get(prestation.id);

        if (data) {
          data.count += item.quantite;

          data.revenue += Number(item.prix) * item.quantite;
        }
      }
    }

    return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
  }

  // =========================
  // DASHBOARD GLOBAL
  // =========================

  async getDashboard(date: Date) {
    const [
      revenue,
      reservations,
      staff,
      prestations,
      today,
      tomorrow,
      stockAlerts,
    ] = await Promise.all([
      this.getDailyRevenue(date),

      this.getReservationStats(date),

      this.getStaffPerformance(date),

      this.getTopPrestations(date),

      this.getTodayReservations(date),

      this.getTomorrowReservations(date),

      this.getStockAlerts(),
    ]);

    return {
      date,

      revenue,

      reservations,

      staff,

      top_prestations: prestations,

      ops: {
        today_reservations: {
          count: today.length,
          data: today,
        },

        tomorrow_reservations: {
          count: tomorrow.length,
          data: tomorrow,
        },

        stock_alerts: stockAlerts,
      },
    };
  }

  // =========================
  // STOCK ALERT
  // =========================

  async getStockAlerts() {
    const produits = await this.produitRepo.find({
      relations: {
        unites: true,
      },
    });

    return produits

      .map((p) => {
        const stock = p.unites.reduce((sum, u) => sum + u.stock, 0);

        return {
          produit: p,

          total_stock: stock,

          stock_minimum: p.stock_minimum,

          is_alert: stock <= p.stock_minimum,
        };
      })

      .filter((p) => p.is_alert);
  }

  async getTodayReservations(date: Date) {
    const { start, end } = this.getDayRange(date);

    return this.reservationRepo.find({
      where: {
        date_debut: Between(start, end),
      },

      relations: {
        client: true,

        personnels: true,

        prestations: {
          prestation: true,
        },
      },

      order: {
        date_debut: 'ASC',
      },
    });
  }

  async getTomorrowReservations(date: Date) {
    const tomorrow = new Date(date);

    tomorrow.setDate(tomorrow.getDate() + 1);

    const { start, end } = this.getDayRange(tomorrow);

    return this.reservationRepo.find({
      where: {
        date_debut: Between(start, end),
      },

      relations: {
        client: true,

        personnels: true,

        prestations: {
          prestation: true,
        },
      },

      order: {
        date_debut: 'ASC',
      },
    });
  }

  // =========================
  // STOCK OVERVIEW
  // =========================

  async getStockOverview() {
    const produits = await this.produitRepo.find({
      relations: {
        unites: true,
        marque: true,
        typeProduit: true,
      },
    });

    return produits.map((p) => {
      const totalStock = p.unites.reduce((sum, u) => sum + u.stock, 0);

      return {
        id: p.id,

        nom: p.nom,

        marque: p.marque?.nom,

        type: p.typeProduit?.nom,

        stock_minimum: p.stock_minimum,

        total_stock: totalStock,

        is_low_stock: totalStock <= p.stock_minimum,

        unites: p.unites.map((u) => ({
          id: u.id,

          nom: u.nom,

          stock: u.stock,

          prix: u.prix,
        })),
      };
    });
  }

  async getStockUnitDashboard() {
    const unites = await this.uniteRepo.find({
      relations: {
        produit: true,
      },
    });

    const data = unites.map((u) => ({
      produit: u.produit.nom,

      unite: u.nom,

      stock: u.stock,

      stock_minimum: u.stock_minimum,

      alert: u.stock <= u.stock_minimum,
    }));

    return {
      total_unites: unites.length,

      alert_count: data.filter((x) => x.alert).length,

      unites: data,
    };
  }

  async getDailyDashboard() {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const ventes = await this.venteRepo.find({
      relations: {
        cashRegister: true,
      },

      where: {
        cashRegister: {
          openedAt: MoreThanOrEqual(today),
        },
      },
    });

    const totalCA = ventes.reduce((sum, v) => sum + Number(v.total), 0);

    return {
      totalCA,

      nombreVentes: ventes.length,

      ticketMoyen: ventes.length ? totalCA / ventes.length : 0,
    };
  }
}
