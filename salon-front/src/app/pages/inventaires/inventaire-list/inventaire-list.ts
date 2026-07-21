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
import { InventaireForm } from '../inventaire-form/inventaire-form';
import { InventaireDetail } from '../inventaire-detail/inventaire-detail';

@Component({
  selector: 'app-inventaire-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent, PageHeaderComponent, SearchBarComponent, PaginationComponent, InventaireForm, InventaireDetail],
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
  showDetails = false;

  selectedInventaire: any = null;
  inventaireToDelete: any = null;

  showDeleteConfirm = false;

  private searchSubject = new Subject<string>();
  private sub!: Subscription;

  columns: TableColumn[] = [
    { field: 'numero', label: 'N°' },
    { field: 'reference', label: 'Référence' },
    { field: 'created_at', label: 'Date', type: 'datehour' },
    { field: 'nbLignes', label: 'Lignes', type: 'badge' },
    {
      field: 'nbLignesEcart',
      label: 'Ecart',
      type: 'badge',
      badgeClass: row => {
        const ecart = Number(row.nbLignesEcart);
        if (ecart > 0) {
          return 'bg-danger';
        }
        if (ecart <= 0) {
          return 'bg-primary';
        }
        return 'bg-primary';
      },
    },
    {
      field: 'statut',
      label: 'Statut',
      type: 'badge',
      badgeClass: row => {
        return row.valide ? 'bg-success' : 'bg-primary';
      },
    },
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
    console.log(row)
    if (row.valide) {
      this.toast.info('L \'inventaire ne peut pas etre supprimer car deja valider');
      return;
    }
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

  view(row: any) {
    this.api.findOne(row.id).subscribe(res => {
      this.selectedInventaire = res;
      this.showDetails = true;

      this.cdr.detectChanges();
    });
  }

  closeDetails() {
    this.showDetails = false;
    this.selectedInventaire = null;
    this.cdr.detectChanges();
  }

  openEdit(row: any) {
    if (row.valide) {
      this.toast.warning('Impossible de modifier un inventaire validé');
      return;
    }

    this.selectedInventaire = row;
    this.showForm = true;
  }

  delete(row: any) {
    if (row.valide) {
      this.toast.warning('Impossible d’archiver un inventaire validé');
      return;
    }

    this.inventaireToDelete = row;
    this.showDeleteConfirm = true;
  }

  confirmDelete() {
    if (!this.inventaireToDelete) {
      return;
    }

    this.api.remove(this.inventaireToDelete.id).subscribe(() => {
      this.toast.success('Inventaire archivé');

      this.showDeleteConfirm = false;
      this.inventaireToDelete = null;

      this.load();
    });
  }
}
