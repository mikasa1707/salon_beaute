import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ModalComponent } from '../../../shared/components/modal/modal';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { DataTableComponent } from '../../../shared/components/data-table/data-table';

import { TableColumn } from '../../../core/models/table-column';
import { InventaireApi } from '../../../core/services/inventaire-api';
import { ToastService } from '../../../core/services/toast';
import { PaginationComponent } from "../../../shared/components/pagination/pagination";

@Component({
  selector: 'app-inventaire-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, ModalComponent, PageHeaderComponent, DataTableComponent, PaginationComponent],
  templateUrl: './inventaire-detail.html',
})
export class InventaireDetail implements OnChanges {
  @Input() inventaire!: any;

  @Output() close = new EventEmitter<void>();
  @Output() validated = new EventEmitter<void>();

  loading = false;
  columns: TableColumn[] = [
    {
      field: 'produitUnite.produit.nom',
      label: 'Produit',
    },
    {
      field: 'produitUnite.nom',
      label: 'Unité',
      type: 'badge',
    },
    {
      field: 'stockTheorique',
      label: 'Théorique',
      type: 'number',
    },
    {
      field: 'stockReel',
      label: 'Réel',
      type: 'number',
    },
    {
      field: 'ecart',
      label: 'Écart',
      type: 'badge',
    },
  ];

  page = 1;
  limit = 10;
  totalPages = 1;

  lignesPage: any[] = [];

  constructor(
    private api: InventaireApi,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  closeModal() {
    this.close.emit();
  }

  validate() {
    this.api.validate(this.inventaire.id).subscribe({
      next: () => {
        this.toast.success('Inventaire validé');
        this.validated.emit();
        this.closeModal();
        this.cdr.detectChanges();
      },
    });
  }

  get stats() {
    const lignes = this.inventaire.lignes ?? [];

    return {
      total: lignes.length,
      ecarts: lignes.filter((x: any) => Number(x.ecart) !== 0).length,
      perte: lignes.filter((x: any) => Number(x.ecart) < 0).length,
      surplus: lignes.filter((x: any) => Number(x.ecart) > 0).length,
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inventaire']) {
      this.page = 1;
      this.updatePagination();
    }
  }

  updatePagination() {
    const lignes = this.inventaire?.lignes ?? [];
    this.totalPages = Math.ceil(lignes.length / this.limit);
    const start = (this.page - 1) * this.limit;
    this.lignesPage = lignes.slice(start, start + this.limit);
  }

  changePage(page: number) {
    this.page = page;
    this.updatePagination();
  }

  changeLimit(limit: number) {
    this.limit = limit;
    this.page = 1;
    this.updatePagination();
  }
}
