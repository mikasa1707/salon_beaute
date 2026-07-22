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
import { StockAlertModal } from '../../shared/components/dashboard/stock-alert-modal/stock-alert-modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',

  standalone: true,

  imports: [CommonModule, KpiCard, CaChart, StockAlert, TopPersonnel, TopProduit, TopPrestation, MouvementList, StockAlertModal],

  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  dashboard: any;

  showStockAlertModal = false;

  constructor(
    private api: DashboardApi,
    private cdr: ChangeDetectorRef,
    private  router: Router
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

  openStockAlertModal() {
    this.showStockAlertModal = true;
  }

  closeStockAlertModal() {
    this.showStockAlertModal = false;
  }

  goStock(item: any) {
    this.closeStockAlertModal();

    this.router.navigate(['/stock'], {
      queryParams: {
        produit: item.id,
      },
    });
  }
}
