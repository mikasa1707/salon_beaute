import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository, Between, LessThanOrEqual } from 'typeorm';

import { Vente } from 'src/ventes/entities/vente.entity';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { Client } from 'src/clients/entities/client.entity';
import { ProduitUnite } from 'src/produits/entities/produit_unites.entity';
import { StockMovement } from 'src/stocks/entities/stock-movements.entity';
import { CashRegister } from 'src/cash-register/entities/cash_registers.entity';

import { DashboardFilterDto } from './dto/dashboard-filter.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Vente)
    private venteRepo: Repository<Vente>,

    @InjectRepository(Reservation)
    private reservationRepo: Repository<Reservation>,

    @InjectRepository(Client)
    private clientRepo: Repository<Client>,

    @InjectRepository(ProduitUnite)
    private produitUniteRepo: Repository<ProduitUnite>,

    @InjectRepository(StockMovement)
    private mouvementRepo: Repository<StockMovement>,

    @InjectRepository(CashRegister)
    private caisseRepo: Repository<CashRegister>,
  ) {}

  async getDashboard(dto: DashboardFilterDto) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // =========================
    // KPI
    // =========================

    const ventes = await this.venteRepo.find({
      where: {
        created_at: Between(today, tomorrow),
      },
    });

    const caJour = ventes.reduce((sum, v) => sum + Number(v.total), 0);

    const reservations = await this.reservationRepo.count({
      where: {
        date_debut: Between(today, tomorrow),
      },
    });

    const clients = await this.clientRepo.count({
      where: {
        created_at: Between(today, tomorrow),
      },
    });

    const panierMoyen = ventes.length ? caJour / ventes.length : 0;

    // =========================
    // EVOLUTION CA 7 jours
    // =========================

    const caEvolution: any[] = [];

    for (let i = 6; i >= 0; i--) {
      const debut = new Date();
      debut.setDate(debut.getDate() - i);
      debut.setHours(0, 0, 0, 0);
      const fin = new Date(debut);
      fin.setDate(fin.getDate() + 1);
      const ventesJour = await this.venteRepo.find({
        where: {
          created_at: Between(debut, fin),
        },
      });

      caEvolution.push({
        date: debut.toISOString().substring(5, 10),
        total: ventesJour.reduce((s, v) => s + Number(v.total), 0),
      });
    }

    // =========================
    // STOCK ALERT
    // =========================

    const stockAlerts = await this.produitUniteRepo.find({
      relations: {
        produit: true,
      },

      where: {
        actif: true,
      },
    });

    const alerts = stockAlerts
      .filter((x) => Number(x.stock) <= Number(x.stock_minimum))
      .map((x) => ({
        id: x.id,

        produit: x.produit.nom,

        unite: x.nom,

        stock: Number(x.stock),

        minimum: Number(x.stock_minimum),
      }));

    // =========================
    // MOUVEMENTS
    // =========================

    const mouvements = await this.mouvementRepo.find({
      relations: {
        produitUnite: {
          produit: true,
        },
      },

      take: 10,

      order: {
        created_at: 'DESC',
      },
    });

    // =========================
    // CAISSE
    // =========================

    const caisse = await this.caisseRepo.findOne({
      where: {
        status: 'OPEN',
      },

      order: {
        id: 'DESC',
      },
    });
    return {
      kpi: {
        caJour,
        ventes: ventes.length,
        reservations,
        clients,
        panierMoyen,
      },

      caEvolution,
      prestations: [],
      personnels: [],
      stockAlerts: alerts,
      mouvements,
      caisse: {
        ouverte: !!caisse,
        solde: Number(
          +(caisse?.totalCash || 0) +
            +(caisse?.openingBalance || 0) -
            +(caisse?.cashout || 0) || 0,
        ),
      },
    };
  }
}
