import { ChangeDetectorRef, Component } from '@angular/core';
import { Produit } from '../../../core/models/produit';
import { TableColumn } from '../../../core/models/table-column';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { ProduitApi } from '../../../core/services/produit-api';
import { ToastService } from '../../../core/services/toast';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog';
import { ProduitForm } from '../produit-form/produit-form';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { DataTableComponent } from '../../../shared/components/data-table/data-table';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { ModalComponent } from '../../../shared/components/modal/modal';

@Component({
  selector: 'app-produit-list',
  standalone: true,
  imports: [SearchBarComponent, PageHeaderComponent, DataTableComponent, PaginationComponent, ModalComponent, ProduitForm],
  templateUrl: './produit-list.html',
  styleUrl: './produit-list.scss',
})
export class ProduitList {
  produits: Produit[] = [];
  page = 1;
  limit = 10;
  total = 0;
  totalPages = 0;
  searchValue = '';
  loading: boolean = false;
  showModal = false;
  selected?: Produit;

  columns: TableColumn[] = [
    { field: 'nom', label: 'Produit', },
    { field: 'marque.nom', label: 'Marque', },
    { field: 'typeProduit.nom', label: 'Type', },
    { field: 'stockTotal', label: 'Stock', },
    { field: 'prix_achat', label: 'Prix achat', type: 'currency', },
    { field: 'prix_vente', label: 'Prix vente', type: 'currency', },
    { field: 'isLowStock', label: 'Stock faible', type: 'boolean', },
  ];

  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  constructor(
    private readonly produitService: ProduitApi,
    private cdr: ChangeDetectorRef,
    private toast: ToastService,
    private confirm: ConfirmDialogService,
  ) { }

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject.pipe(debounceTime(600), distinctUntilChanged()).subscribe(value => {
      this.searchValue = value;
      console.log(value);
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

  load(_search: any = '') {
    this.loading = true;
    this.produitService.findAll(this.page, this.limit, _search).subscribe({
      next: (res: { data: any[]; totalPages: number; total: number }) => {
        console.log(res);
        this.produits = res.data;
        this.total = res.total;
        this.totalPages = res.totalPages;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Erreur lors du chargement des produits:', err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  changePage(page: number) {
    this.page = page;
    this.load();
  }

  changeLimit(newLimit: number) {
    this.limit = newLimit;
    this.page = 1; // 💡 Sécurité : On revient à la page 1 si la taille d'affichage change
    this.load();
  }

  search(value: string) {
    const text = value.toLowerCase().trim();
    this.searchSubject.next(text);
  }

  async delete(id: number) {
    const ok = await this.confirm.confirm({
      title: 'Suppression produit',
      message: 'La produit sera archivé.',
      confirmText: 'Archiver',
      confirmClass: 'btn-danger',
    });

    if (!ok) return;

    this.produitService.remove(id).subscribe(() => {
      this.toast.error('Produit archiver');
      this.load();
    });
  }

  openCreate() {
    this.selected = undefined;
    this.showModal = true;
  }

  openEdit(produit: Produit) {
    this.selected = produit;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  save() {
    this.showModal = false;
    this.load();
  }
}
