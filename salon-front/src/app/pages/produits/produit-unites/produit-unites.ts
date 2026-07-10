import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Subject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs';
import { Produit } from '../../../core/models/produit';
import { ProduitUnite } from '../../../core/models/produit-unite';
import { TableColumn } from '../../../core/models/table-column';
import { ProduitUniteApi } from '../../../core/services/produit-unite-api';
import { ToastService } from '../../../core/services/toast';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog';
import { PageHeaderComponent } from "../../../shared/components/page-header/page-header";
import { SearchBarComponent } from "../../../shared/components/search-bar/search-bar";
import { DataTableComponent } from "../../../shared/components/data-table/data-table";
import { PaginationComponent } from "../../../shared/components/pagination/pagination";
import { ModalComponent } from "../../../shared/components/modal/modal";
import { ProduitUnitesForm } from "../produit-unites-form/produit-unites-form";

@Component({
  selector: 'app-produit-unites',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    SearchBarComponent,
    DataTableComponent,
    PaginationComponent,
    ModalComponent,
    ProduitUnitesForm
  ],
  templateUrl: './produit-unites.html',
  styleUrl: './produit-unites.scss',
})
export class ProduitUnites implements OnInit, OnDestroy, OnChanges {
  @Input({ required: true })

  produit!: Produit;
  unites: ProduitUnite[] = [];

  page = 1;
  limit = 10;

  total = 0;
  totalPages = 0;
  searchValue = '';
  loading = false;
  showModal = false;
  selected?: ProduitUnite;

  columns: TableColumn[] = [
    { field: 'nom', label: 'Unité' },
    { field: 'code', label: 'Code' },
    { field: 'stock', label: 'Stock', lowStock: true },
    { field: 'prix', label: 'Prix', type: 'currency' },
    { field: 'stock_minimum', label: 'Stock minimum' },
  ];

  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  constructor(
    private readonly produitUniteService: ProduitUniteApi,
    private readonly cdr: ChangeDetectorRef,
    private readonly toast: ToastService,
    private readonly confirm: ConfirmDialogService,
  ) { }

  ngOnInit() {
    this.searchSubscription =
      this.searchSubject.pipe(debounceTime(600), distinctUntilChanged()).subscribe(value => {
        this.searchValue = value;
        this.page = 1;
        this.load(value);
      });
    this.load();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['produit']?.currentValue) {
      this.page = 1;
      this.load(this.searchValue);
    }
  }

  ngOnDestroy() {
    this.searchSubscription?.unsubscribe();
  }

  load(search = '') {
    if (!this.produit?.id) {
      return;
    }

    this.loading = true;

    this.produitUniteService
      .findAll(
        this.produit.id,
        this.page,
        this.limit,
        search
      )
      .subscribe({
        next: (res) => {
          this.unites = res.data;
          this.total = res.total;
          this.totalPages = res.totalPages;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.toast.error('Erreur chargement unités');
        }
      });
  }

  changePage(page: number) {
    this.page = page;
    this.load(
      this.searchValue
    );
  }

  changeLimit(limit: number) {
    this.limit = limit;
    this.page = 1;
    this.load(
      this.searchValue
    );
  }

  search(value: string) {
    this.searchSubject.next(
      value.trim().toLowerCase()
    );
  }

  async delete(id: number) {
    const ok = await this.confirm.confirm({
      title: 'Suppression unité',
      message: 'Cette unité sera archivée.',
      confirmText: 'Archiver',
      confirmClass: 'btn-danger'
    });

    if (!ok) {
      return;
    }
    this.produitUniteService
      .remove(id)
      .subscribe(() => {
        this.toast.error(
          'Unité archivée'
        );
        this.load(
          this.searchValue
        );
      });
  }

  openCreate() {
    this.selected = undefined;
    this.showModal = true;
  }

  openEdit(unite: ProduitUnite) {
    this.selected = unite;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  save() {
    this.showModal = false;
    this.load(
      this.searchValue
    );
  }
}