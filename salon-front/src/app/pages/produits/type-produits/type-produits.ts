import { ChangeDetectorRef, Component } from '@angular/core';
import { TypeProduit } from '../../../core/models/type-produit';
import { TableColumn } from '../../../core/models/table-column';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { TypeProduitApi } from '../../../core/services/type-produit-api';
import { ToastService } from '../../../core/services/toast';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog';
import { ModalComponent } from "../../../shared/components/modal/modal";
import { PaginationComponent } from "../../../shared/components/pagination/pagination";
import { DataTableComponent } from "../../../shared/components/data-table/data-table";
import { SearchBarComponent } from "../../../shared/components/search-bar/search-bar";
import { PageHeaderComponent } from "../../../shared/components/page-header/page-header";
import { TypeProduitForm } from "../type-produit-form/type-produit-form";

@Component({
  selector: 'app-type-produits',
  imports: [ModalComponent, PaginationComponent, DataTableComponent, SearchBarComponent, PageHeaderComponent, TypeProduitForm],
  templateUrl: './type-produits.html',
  styleUrl: './type-produits.scss',
})
export class TypeProduits {
  typeProduits: TypeProduit[] = [];
  page = 1;
  limit = 10;
  total = 0;
  totalPages = 0;
  searchValue = '';
  loading: boolean = false;
  showUnitesModal = false;
  showModal = false;
  selected?: TypeProduit;

  columns: TableColumn[] = [
    { field: 'nom', label: 'TypeProduit', },
    { field: 'nbProduits', label: 'Produits', type: 'badge' },
    { field: 'color', label: 'Couleur', type: 'color' },
  ];

  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;
  produits: any;

  constructor(
    private readonly typeProduitService: TypeProduitApi,
    private cdr: ChangeDetectorRef,
    private toast: ToastService,
    private confirm: ConfirmDialogService,
  ) { }

  ngOnInit(): void {
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

  load(_search: any = '') {
    this.loading = true;
    this.typeProduitService.findAll(this.page, this.limit, _search).subscribe({
      next: (res: { data: any[]; totalPages: number; total: number }) => {
        this.typeProduits = res.data;
        console.log(res.data)
        this.total = res.total;
        this.totalPages = res.totalPages;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Erreur lors du chargement des typeProduits:', err);
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

    this.typeProduitService.remove(id).subscribe(() => {
      this.toast.error('Type Produit archiver');
      this.load();
    });
  }

  openCreate() {
    this.selected = undefined;
    this.showModal = true;
  }

  openEdit(produit: TypeProduit) {
    this.selected = produit;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selected = undefined;
  }

  save() {
    this.showModal = false;
    this.load();
    this.selected = undefined;
  }
}
