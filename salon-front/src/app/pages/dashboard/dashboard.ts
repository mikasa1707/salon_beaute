import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardApi } from '../../core/services/dashboard';
import { KpiCard } from '../../shared/components/dashboard/kpi-card/kpi-card';
import { CaChart } from '../../shared/components/dashboard/ca-chart/ca-chart';
import { StockAlert } from '../../shared/components/dashboard/stock-alert/stock-alert';
import { CaisseCard } from '../../shared/components/dashboard/caisse-card/caisse-card';
import { MouvementList } from '../../shared/components/dashboard/mouvement-list/mouvement-list';
import { TopPersonnel } from '../../shared/components/dashboard/top-personnel/top-personnel';
import { TopProduit } from '../../shared/components/dashboard/top-produit/top-produit';
import { TopPrestation } from '../../shared/components/dashboard/top-services/top-services';

@Component({
  selector: 'app-dashboard-page',

  standalone: true,

  imports: [CommonModule, KpiCard, CaChart, StockAlert, CaisseCard, TopPersonnel, TopProduit, TopPrestation, MouvementList],

  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  dashboard: any;

  constructor(
    private api: DashboardApi,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.get().subscribe({
      next: data => {
        this.dashboard = data;
        this.cdr.detectChanges();
      },
    });
  }
}
