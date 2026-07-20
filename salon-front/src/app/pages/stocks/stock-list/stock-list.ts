import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

import { StockApi } from '../../../core/services/stock-api';
import { ProduitUniteApi } from '../../../core/services/produit-unite-api';
import { ProduitUniteStock } from '../../../core/models/stock';
import { TableColumn } from '../../../core/models/table-column';

import { DataTableComponent } from '../../../shared/components/data-table/data-table';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';

import { ToastService } from '../../../core/services/toast';
import { StockMovement } from '../../../core/models/stock-movement';

enum StockMode {
  LIST = 'LIST',
  ENTRY = 'ENTRY',
  ADJUST = 'ADJUST',
}

@Component({
  selector: 'app-stock-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, SearchBarComponent, DataTableComponent, ModalComponent, PaginationComponent],
  templateUrl: './stock-list.html',
  styleUrl: './stock-list.scss',
})
export class StockList implements OnInit, OnDestroy {
  entryCache: Record<number, number> = {};
  mode: StockMode = StockMode.LIST;
  stocks: StockMovement[] = [];
  produitsUnites: ProduitUniteStock[] = [];
  loading = false;
  showMovement = false;
  // ============================
  // STOCK ENTRY
  // ============================

  reference = '';
  note = '';
  showConfirm = false;

  // ============================
  // PAGINATION
  // ============================

  page = 1;
  limit = 10;
  total = 0;
  totalPages = 0;
  searchValue = '';

  pagemove = 1;
  limitmove = 10;
  totalmove = 0;
  totalPagesmove = 0;

  // ============================
  // TABLE
  // ============================

  columns: TableColumn[] = [
    { field: 'produit.nom', label: 'Produit' },
    { field: 'nom', label: 'Unité' },
    { field: 'code', label: 'Code' },
    { field: 'stock', label: 'Stock', type: 'badge' },
  ];

  columns_movement: TableColumn[] = [
    { field: 'created_at', label: 'Date', type: 'datehour' },
    { field: 'produitUnite.produit.nom', label: 'Produit' },
    { field: 'produitUnite.nom', label: 'Unité' },
    { field: 'type', label: 'Type', type: 'badge' },
    { field: 'quantite', label: 'Quantité' },
  ];

  private searchSubject = new Subject<string>();

  private searchSubscription!: Subscription;

  constructor(
    private stockApi: StockApi,
    private produitUniteApi: ProduitUniteApi,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject.pipe(debounceTime(600), distinctUntilChanged()).subscribe(value => {
      this.searchValue = value;

      this.page = 1;

      this.loadProduits(value);
    });

    this.loadProduits();
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  // ============================
  // LOAD STOCK
  // ============================

  loadProduits(search: string = '') {
    this.loading = true;

    this.produitUniteApi.findAll(this.page, this.limit, search).subscribe({
      next: res => {
        this.produitsUnites = res.data.map((item: ProduitUniteStock) => ({
          ...item,
          // conservation saisie
          entry: this.entryCache[item.id] ?? 0,
        }));
        this.total = res.total;
        this.totalPages = res.totalPages;
        this.loading = false;
        this.cdr.detectChanges();
      },

      error: err => {
        this.toast.error('Erreur chargement stock');
        this.loading = false;
      },
    });
  }

  // ============================
  // SEARCH
  // ============================

  search(value: string) {
    this.searchSubject.next(value.trim().toLowerCase());
  }

  // ============================
  // MODE ENTRY
  // ============================

  startEntry() {
    this.mode = StockMode.ENTRY;

    this.columns = [
      { field: 'produit.nom', label: 'Produit' },
      { field: 'code', label: 'Code' },
      { field: 'nom', label: 'Unité' },
      { field: 'stock', label: 'Stock actuel' },
      { field: 'entry', label: 'Entrée', type: 'input-number' },
    ];

    /**
     * Initialisation
     */
    this.produitsUnites.forEach(x => {
      if (x.entry === undefined) {
        x.entry = 0;
      }
    });
  }

  cancelEntry() {
    this.mode = StockMode.LIST;
    this.reference = '';
    this.note = '';
    this.entryCache = {};

    this.produitsUnites.forEach(x => {
      x.entry = 0;
    });
    this.columns = [
      { field: 'produit.nom', label: 'Produit' },
      { field: 'nom', label: 'Unité' },
      { field: 'code', label: 'Code' },
      { field: 'stock', label: 'Stock', type: 'badge' },
    ];
  }

  // ============================
  // TABLE INPUT
  // ============================

  changeQuantity(event: any) {
    const row = event.row;
    const value = Number(event.value);
    row.entry = value;
    this.entryCache[row.id] = value;
  }

  // ============================
  // PAGINATION
  // ============================

  changePage(page: number) {
    this.page = page;

    this.loadProduits(this.searchValue);
  }

  changeLimit(limit: number) {
    this.limit = limit;
    this.page = 1;
    this.loadProduits(this.searchValue);
  }

  // ============================
  // SAVE
  // ============================

  get entryItems() {
    return Object.entries(this.entryCache)
      .filter(([_, value]) => Number(value) > 0)
      .map(([id, value]) => ({
        produitUniteId: Number(id),
        quantite: Number(value),
      }));
  }

  save() {
    if (!this.entryItems.length) {
      this.toast.warning('Aucune quantité saisie');
      return;
    }

    this.showConfirm = true;
  }

  confirm() {
    const dto = {
      reference: this.reference,
      note: this.note,
      items: this.entryItems,
    };

    this.stockApi.entry(dto).subscribe({
      next: () => {
        this.toast.success('Entrée stock enregistrée');

        this.showConfirm = false;
        this.cancelEntry();
        this.loadProduits();
      },

      error: () => {
        this.toast.error('Erreur entrée stock');
      },
    });
  }

  viewMovement(produit: any) {
    this.stockApi.findAllByproduit(this.pagemove, this.limitmove, '', produit.id).subscribe({
      next: res => {
        this.stocks = res.data;
        this.total = res.totalmove;
        this.totalPages = res.totalPagesmove;
        this.showMovement = true;
        this.cdr.detectChanges();
      },
    });
  }
}
