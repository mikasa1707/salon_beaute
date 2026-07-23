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
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-vente-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent, PageHeaderComponent, VenteDetails, SearchBarComponent, PaginationComponent, ModalComponent],
  templateUrl: './vente-list.html',
})
export class VenteList implements OnInit {
  ventes: Vente[] = [];
  loading = false;
  page = 1;
  limit = 10;
  total = 0;
  totalPages = 0;
  searchValue = '';

  statutPaiement = '';
  selected: any = null;
  show = false;

  columns: TableColumn[] = [
    {
      field: 'numero',
      label: 'N° Vente',
    },

    {
      field: 'nomComplet',
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
      type: 'badge',
      badgeClass: row => (row.statutPaiement === 'NON_PAYE' ? 'bg-danger' : row.statutPaiement === 'PARTIEL' ? 'bg-warning' : 'bg-success'),
    },

    {
      field: 'created_at',
      label: 'Date',
      type: 'datehour',
    },
  ];

  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  constructor(
    private api: VentesApi,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.searchSubscription = this.searchSubject.pipe(debounceTime(600), distinctUntilChanged()).subscribe(value => {
      this.searchValue = value;
      this.page = 1;
      this.load(value);
    });
    this.load();
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  load(_search = '') {
    this.loading = true;
    this.api.findAll(this.page, this.limit, _search, this.statutPaiement).subscribe({
      next: res => {
        this.ventes = res.data;
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

  search(value: string) {
    const text = value.toLowerCase().trim();
    this.searchSubject.next(text);
  }

  changePage(p: number) {
    this.page = p;

    this.load();
  }

  changeLimit(newLimit: number) {
    this.limit = newLimit;
    this.page = 1; // 💡 Sécurité : On revient à la page 1 si la taille d'affichage change
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
    this.show = true;
  }

  close() {
    this.show = false;

    this.selected = null;
  }

  cancel(item: any) {
    if (!confirm('Annuler cette vente ?')) return;

    this.api.cancel(item.id).subscribe(() => {
      this.load();
    });
  }

  openCaisse() {
    this.router.navigateByUrl('/caisse');
  }
}
