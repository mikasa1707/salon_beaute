import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TableColumn } from '../../../core/models/table-column';
import { Prestation } from '../../../core/models/prestation';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog';
import { PrestationApi } from '../../../core/services/prestation-api';
import { ToastService } from '../../../core/services/toast';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { DataTableComponent } from '../../../shared/components/data-table/data-table';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { PrestationForm } from '../prestation-form/prestation-form';
import { PrestationRecetteModal } from "../prestation-recette-modal/prestation-recette-modal";

@Component({
  selector: 'app-prestation-list',
  standalone: true,
  imports: [
    SearchBarComponent,
    PageHeaderComponent,
    DataTableComponent,
    PaginationComponent,
    ModalComponent,
    PrestationForm,
    PrestationRecetteModal
],
  templateUrl: './prestation-list.html',
  styleUrl: './prestation-list.scss',
})
export class PrestationList implements OnInit {
  prestations: Prestation[] = [];
  page = 1;
  limit = 10;
  total = 0;
  totalPages = 0;
  searchValue = '';
  loading: boolean = false;
  showModal = false;
  selected?: Prestation;
  selectedPrestation: any;
  showRecette = false;

  columns: TableColumn[] = [
    { field: 'nom', label: 'Prestations' },
    { field: 'duree', label: 'Durée', type: 'timemn' },
    { field: 'prix', label: 'Prix', type: 'currency' },
    { field: 'typePrestation.nom', label: 'Type de prestation' },
  ];

  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  constructor(
    private readonly prestationService: PrestationApi,
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
    this.prestationService.findAll(this.page, this.limit, _search).subscribe({
      next: (res: { data: any[]; totalPages: number; total: number }) => {
        console.log(res);
        this.prestations = res.data;
        this.total = res.total;
        this.totalPages = res.totalPages;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Erreur lors du chargement des prestations:', err);
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
      message: 'La prestation sera archivé.',
      confirmText: 'Archiver',
      confirmClass: 'btn-danger',
    });

    if (!ok) return;

    this.prestationService.remove(id).subscribe(() => {
      this.toast.error('Prestation archiver');
      this.load();
    });
  }

  openCreate() {
    this.selected = undefined;
    this.showModal = true;
  }

  openEdit(prestation: Prestation) {
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

  openRecette(prestation: any) {
    this.selectedPrestation = prestation;
    this.showRecette = true;
  }
}
