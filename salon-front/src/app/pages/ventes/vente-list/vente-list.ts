import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from '../../../shared/components/data-table/data-table';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { FormsModule } from '@angular/forms';
import { VenteDetails } from '../vente-details/vente-details';
import { VentesApi } from '../../../core/services/vente-api';
import { Vente } from '../../../core/models/vente';
import { TableColumn } from '../../../core/models/table-column';

@Component({
  selector: 'app-vente-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent, PageHeaderComponent, VenteDetails],
  templateUrl: './vente-list.html',
})
export class VenteList implements OnInit {
  ventes: Vente[] = [];
  loading = false;
  page = 1;
  limit = 10;
  totalPages = 0;
  search = '';
  statutPaiement = '';
  selected: any = null;
  showDetail = false;

  columns: TableColumn[] = [
    {
      field: 'numero',
      label: 'N° Vente',
    },

    {
      field: 'client',
      label: 'Client',
    },

    {
      field: 'total',
      label: 'Total',

      type: 'currency',
    },

    {
      field: 'montantPaye',
      label: 'Payé',

      type: 'currency',
    },

    {
      field: 'reste',
      label: 'Reste',

      type: 'currency',
    },

    {
      field: 'statutPaiement',
      label: 'Paiement',
      badgeClass: (row: any) => {
        switch (row.statutPaiement) {
          case 'PAYE':
            return 'success';
          case 'PARTIEL':
            return 'warning';
          case 'NON_PAYE':
            return 'danger';
          default:
            return 'secondary';
        }
      },
    },

    {
      field: 'created_at',
      label: 'Date',

      type: 'date',
    },
  ];

  constructor(
    private api: VentesApi,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.api.findAll(this.page, this.limit, this.search, this.statutPaiement).subscribe({
      next: res => {
        this.ventes = res.data;
        this.totalPages = res.totalPages;
        this.loading = false;
        this.cdr.detectChanges();
      },

      error: () => {
        this.loading = false;
      },
    });
  }

  changePage(p: number) {
    this.page = p;

    this.load();
  }

  searchChange() {
    this.page = 1;

    this.load();
  }

  filterPaiement(value: string) {
    this.statutPaiement = value;

    this.page = 1;

    this.load();
  }

  view(item: any) {
    this.selected = item;

    this.showDetail = true;
  }

  closeDetail() {
    this.showDetail = false;

    this.selected = null;
  }

  cancel(item: any) {
    if (!confirm('Annuler cette vente ?')) return;

    this.api.cancel(item.id).subscribe(() => {
      this.load();
    });
  }
}
