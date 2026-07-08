import { ChangeDetectorRef, Component } from '@angular/core';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { TableColumn } from '../../../core/models/table-column';
import { DataTableComponent } from '../../../shared/components/data-table/data-table';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { TypePrestation } from '../../../core/models/prestation';
import { ToastService } from '../../../core/services/toast';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog';
import { TypeprestationApi } from '../../../core/services/typeprestation-api';
import { TypePrestationForm } from "../type-prestation-form/type-prestation-form";

@Component({
  selector: 'app-type-prestation-list',
  standalone: true,
  imports: [SearchBarComponent, PageHeaderComponent, DataTableComponent, PaginationComponent, ModalComponent, TypePrestationForm],
  templateUrl: './type-prestation-list.html',
  styleUrl: './type-prestation-list.scss',
})
export class TypePrestationList {
  type_prestations: TypePrestation[] = [];
  page = 1;
  limit = 10;
  total = 0;
  totalPages = 0;
  searchValue = '';
  loading: boolean = false;
  showModal = false;
  selected?: TypePrestation;

  columns: TableColumn[] = [
    { field: 'nom', label: 'Label' },
  ];

  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  constructor(
    private readonly typePrestationService: TypeprestationApi,
    private cdr: ChangeDetectorRef,
    private toast: ToastService,
    private confirm: ConfirmDialogService,
  ) {}

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
    this.typePrestationService.findAll(this.page, this.limit, _search).subscribe({
      next: (res: { data: any[]; totalPages: number; total: number }) => {
        console.log(res);
        this.type_prestations = res.data;
        this.total = res.total;
        this.totalPages = res.totalPages;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Erreur lors du chargement des typePrestations:', err);
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
      title: 'Suppression prestation',
      message: 'Le Type de Prestation sera archivé.',
      confirmText: 'Archiver',
      confirmClass: 'btn-danger',
    });

    if (!ok) return;

    this.typePrestationService.remove(id).subscribe(() => {
      this.toast.error(' Type de Prestation archiver');
      this.load();
    });
  }

  openCreate() {
    this.selected = undefined;
    this.showModal = true;
  }

  openEdit(prestation: TypePrestation) {
    this.selected = prestation;
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
