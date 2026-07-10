import { ChangeDetectorRef, Component } from '@angular/core';
import { TableColumn } from '../../../core/models/table-column';
import { Marque } from '../../../core/models/marques';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { MarqueApi } from '../../../core/services/marque-api';
import { ToastService } from '../../../core/services/toast';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog';
import { PageHeaderComponent } from "../../../shared/components/page-header/page-header";
import { SearchBarComponent } from "../../../shared/components/search-bar/search-bar";
import { PaginationComponent } from "../../../shared/components/pagination/pagination";
import { ModalComponent } from "../../../shared/components/modal/modal";
import { DataTableComponent } from "../../../shared/components/data-table/data-table";
import { MarqueForm } from "../marque-form/marque-form";

@Component({
  selector: 'app-marque-list',
  imports: [PageHeaderComponent, SearchBarComponent, PaginationComponent, ModalComponent, DataTableComponent, MarqueForm],
  templateUrl: './marque-list.html',
  styleUrl: './marque-list.scss',
})
export class MarqueList {
  marques: Marque[] = [];
  page = 1;
  limit = 10;
  total = 0;
  totalPages = 0;
  searchValue = '';
  loading: boolean = false;
  showUnitesModal = false;
  showModal = false;
  selected?: Marque;

  columns: TableColumn[] = [
    { field: 'nom', label: 'Marque', },
    { field: 'nbProduits', label: 'Produits', type: 'badge' },
  ];

  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;
  produits: any;

  constructor(
    private readonly marqueService: MarqueApi,
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
    this.marqueService.findAll(this.page, this.limit, _search).subscribe({
      next: (res: { data: any[]; totalPages: number; total: number }) => {
        this.marques = res.data;
        console.log(res.data)
        this.total = res.total;
        this.totalPages = res.totalPages;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Erreur lors du chargement des marques:', err);
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

    this.marqueService.remove(id).subscribe(() => {
      this.toast.error('Marque archiver');
      this.load();
    });
  }

  openCreate() {
    this.selected = undefined;
    this.showModal = true;
  }

  openEdit(produit: Marque) {
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
