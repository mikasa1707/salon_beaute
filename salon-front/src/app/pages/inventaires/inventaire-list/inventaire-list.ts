import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { InventaireApi } from '../../../core/services/inventaire-api';
import { Inventaire } from '../../../core/models/inventaires';
import { TableColumn } from '../../../core/models/table-column';
import { DataTableComponent } from '../../../shared/components/data-table/data-table';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { ToastService } from '../../../core/services/toast';
import { InventaireForm } from "../inventaire-form/inventaire-form";

@Component({
  selector: 'app-inventaire-list',

  standalone: true,

  imports: [CommonModule, FormsModule, DataTableComponent, PageHeaderComponent, SearchBarComponent, PaginationComponent, InventaireForm],

  templateUrl: './inventaire-list.html',

  styleUrl: './inventaire-list.scss',
})
export class InventaireList implements OnInit {
  inventaires: Inventaire[] = [];
  loading = false;
  page = 1;
  limit = 10;
  total = 0;
  totalPages = 0;
  searchValue = '';

  showForm = false;

  private searchSubject = new Subject<string>();
  private sub!: Subscription;

  columns: TableColumn[] = [
    { field: 'numero', label: 'N°' },
    { field: 'reference', label: 'Référence' },
    { field: 'created_at', label: 'Date', type: 'datehour' },
    { field: 'nbLignes', label: 'Lignes', type: 'badge' },
    { field: 'nbLignesEcart', label: 'Ecart', type: 'badge' },
    { field: 'statut', label: 'Statut', type: 'badge' },
  ];

  constructor(
    private api: InventaireApi,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.sub = this.searchSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe(value => {
      this.page = 1;

      this.load(value);
    });

    this.load();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  load(search = '') {
    this.loading = true;

    this.api.findAll(this.page, this.limit, search).subscribe({
      next: res => {
        this.inventaires = res.data;
        this.total = res.total;
        this.totalPages = res.totalPages;
        this.loading = false;
        this.cdr.detectChanges();
      },

      error: () => {
        this.toast.error('Erreur chargement inventaires');

        this.loading = false;
      },
    });
  }

  search(value: string) {
    const text = value.toLowerCase().trim();
    this.searchSubject.next(text);
  }

  changePage(page: number) {
    this.page = page;

    this.load(this.searchValue);
  }

  changeLimit(limit: number) {
    this.limit = limit;

    this.page = 1;

    this.load(this.searchValue);
  }

  deactivate(row: Inventaire) {
    this.api.deactivate(row.id).subscribe({
      next: () => {
        this.toast.success('Inventaire désactivé');

        this.load();
      },

      error: err => {
        this.toast.error(err.error?.message ?? 'Erreur');
      },
    });
  }

  newInventaire() {
    this.showForm = true;
  }
}
