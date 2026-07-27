import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { CashRegister } from '../../../core/models/cash-register';
import { TableColumn } from '../../../core/models/table-column';

import { CashRegisterApi } from '../../../core/services/cash-register-api';

import { DataTableComponent } from '../../../shared/components/data-table/data-table';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';

import { KpiCard } from '../../../shared/components/dashboard/kpi-card/kpi-card';
import { CashMovementList } from '../../../shared/components/cash-register/cash-movement-list/cash-movement-list';
import { PageHeaderComponent } from "../../../shared/components/page-header/page-header";

@Component({
  selector: 'app-cash-history',
  standalone: true,
  imports: [CommonModule, DataTableComponent, PaginationComponent, ModalComponent, KpiCard, CashMovementList, PageHeaderComponent],
  templateUrl: './cash-history.html',
})
export class CashHistory implements OnInit, OnChanges {
  @Input() refresh = 0;

  data: CashRegister[] = [];

  loading = false;
  page = 1;
  limit = 10;
  total = 0;
  totalPages = 0;
  selected?: CashRegister;
  selectedReport: any;
  showDetail = false;
  refreshMovements = 0;

  columns: TableColumn[] = [
    {
      field: 'openedAt',
      label: 'Ouverture',
      type: 'datehour',
    },

    {
      field: 'closedAt',
      label: 'Fermeture',
      type: 'datehour',
    },

    {
      field: 'openingBalance',
      label: 'Fond initial',
      type: 'currency',
    },

    {
      field: 'closingBalance',
      label: 'Fermeture',
      type: 'currency',
    },

    {
      field: 'status',
      label: 'Statut',
      type: 'badge',

      badgeClass: value => (value.status === 'OPEN' ? 'bg-success' : value === 'FORCED' ? 'bg-danger' : 'bg-warning'),
    },
  ];

  constructor(
    private readonly api: CashRegisterApi,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['refresh']) {
      this.load();
    }
  }

  load() {
    this.loading = true;

    this.api.history(this.page, this.limit).subscribe({
      next: res => {
        this.data = res.data;

        this.total = res.total;

        this.totalPages = res.totalPages;

        this.loading = false;

        this.cdr.detectChanges();
      },

      error: () => {
        this.loading = false;
      },
    });
  }

  view(row: CashRegister) {
    this.selected = row;

    /*
      Charger rapport complet
      API conseillé:
      GET /cash-register/:id/report
    */

    this.api.detail(row.id).subscribe({
      next: res => {
        this.selectedReport = res;
        console.log(res)
        this.showDetail = true;
        this.refreshMovements++;
        this.cdr.detectChanges();
      },
    });
  }

  close() {
    this.showDetail = false;

    this.selected = undefined;

    this.selectedReport = undefined;
  }

  changePage(page: number) {
    this.page = page;

    this.load();
  }
}
