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

  // =========================
  // UTILS DATE RANGE
  // =========================
  private getDayRange(date: Date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  // =========================
  // 💰 REVENUE
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
  // 📅 RESERVATIONS STATS
  // =========================
  async getReservationStats(date: Date) {
    const { start, end } = this.getDayRange(date);

    const reservations = await this.reservationRepo.find({
      where: {
        date_debut: Between(start, end),
      },
    });

    const total = reservations.length;

    const en_attente = reservations.filter(
      (r) => r.statut === ReservationStatut.EN_ATTENTE,
    ).length;

    const confirmees = reservations.filter(
      (r) => r.statut === ReservationStatut.CONFIRMEE,
    ).length;

    const en_cours = reservations.filter(
      (r) => r.statut === ReservationStatut.EN_COURS,
    ).length;

    const terminees = reservations.filter(
      (r) => r.statut === ReservationStatut.TERMINEE,
    ).length;

    const annulees = reservations.filter(
      (r) => r.statut === ReservationStatut.ANNULEE,
    ).length;

    return {
      total,
      en_attente,
      confirmees,
      en_cours,
      terminees,
      annulees,
    };
  }

  // =========================
  // 👩‍💼 STAFF PERFORMANCE
  // =========================
  async getStaffPerformance(date: Date) {
    const { start, end } = this.getDayRange(date);

    const reservations = await this.reservationRepo.find({
      where: {
        date_debut: Between(start, end),
        statut: ReservationStatut.TERMINEE,
      },
      relations: { personnel: true },
    });

    const map = new Map<number, StaffStats>();

    for (const r of reservations) {
      const staffId = r.personnel.id;

      const revenue = Number(r.total_prix ?? 0);

      if (!map.has(staffId)) {
        map.set(staffId, {
          personnel: r.personnel,
          total_revenue: 0,
          reservations_count: 0,
        });
      }

      const data = map.get(staffId);

      if (!data) return;
      data.total_revenue += revenue;
      data.reservations_count += 1;
    }

    return Array.from(map.values()).sort(
      (a, b) => b.total_revenue - a.total_revenue,
    );
  }

  // =========================
  // 🔥 TOP PRESTATIONS
  // =========================
  async getTopPrestations(date: Date) {
    const { start, end } = this.getDayRange(date);

    const reservations = await this.reservationRepo.find({
      where: {
        date_debut: Between(start, end),
        statut: ReservationStatut.TERMINEE,
      },
      relations: { prestations: { prestation: true } },
    });

    const map = new Map<number, PrestaStats>();

    for (const r of reservations) {
      for (const p of r.prestations) {
        const id = p.prestation.id;

        if (!map.has(id)) {
          map.set(id, {
            prestation: p.prestation,
            count: 0,
            revenue: 0,
          });
        }

        const data = map.get(id);

        if (!data) return;
        data.count += p.quantite;
        data.revenue += Number(p.prix) * p.quantite;
      }
    }

    return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
  }

  // =========================
  // 📊 GLOBAL DASHBOARD
  // =========================
  async getDashboard(date: Date) {
    const [
      revenue,
      reservations,
      staff,
      top,
      todayRes,
      tomorrowRes,
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
      top_prestations: top,

      ops: {
        today_reservations: {
          count: todayRes.length,
          data: todayRes,
        },
        tomorrow_reservations: {
          count: tomorrowRes.length,
          data: tomorrowRes,
        },
        stock_alerts: stockAlerts,
      },
    };
  }

  async getStockAlerts() {
    const produits = await this.produitRepo.find({
      relations: { unites: true },
    });

    return produits
      .map((p) => {
        const total = p.unites.reduce((s, u) => s + u.stock, 0);

        return {
          produit: p,
          total_stock: total,
          stock_minimum: p.stock_minimum,
          is_alert: total <= p.stock_minimum,
        };
      })
      .filter((p) => p.is_alert);
  }

  async getTodayReservations(date: Date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return this.reservationRepo.find({
      where: {
        date_debut: Between(start, end),
      },
      relations: { client: true, personnel: true, prestations: true },
      order: {
        date_debut: 'ASC',
      },
    });
  }

  async getTomorrowReservations(date: Date) {
    const tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const start = new Date(tomorrow);
    start.setHours(0, 0, 0, 0);

    const end = new Date(tomorrow);
    end.setHours(23, 59, 59, 999);

    return this.reservationRepo.find({
      where: {
        date_debut: Between(start, end),
      },
      relations: { client: true, personnel: true },
      order: {
        date_debut: 'ASC',
      },
    });
  }

  async getStockOverview() {
    const produits = await this.produitRepo.find({
      relations: { unites: true, marque: true, typeProduit: true },
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

  async getDailyDashboard(salonId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const ventes = await this.venteRepo.find({
      where: {
        cashRegister: {
          salonId,
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

  async getDashboardStock() {
    const [overview, alerts, alertfull] = await Promise.all([
      this.getStockOverview(),
      this.getStockAlerts(),
      this.getStockAlertsFull(),
    ]);

    return {
      total_produits: overview.length,
      produits_en_alerte: alerts.length,
      produits: overview,
      alertes: alerts,
      alertes_full: alertfull,
    };
  }

  async getStockUnitDashboard() {
    const unites = await this.uniteRepo.find({
      relations: { produit: true },
    });

    const mapped = unites.map((u) => ({
      produit: u.produit.nom,
      unite: u.nom,
      stock: u.stock,
      stock_minimum: u.stock_minimum,
      alert: u.stock <= u.stock_minimum,
    }));

    return {
      total_unites: unites.length,
      alert_count: mapped.filter((u) => u.alert).length,
      unites: mapped,
    };
  }

  async getStockAlertsFull() {
    const unites = await this.getStockAlerts();

    const produitsMap = new Map<number, boolean>();

    for (const u of unites) {
      produitsMap.set(u.produit.id, true);
    }

    return {
      unit_alerts: unites,
      total_alerts: unites.length,
    };
  }
}
