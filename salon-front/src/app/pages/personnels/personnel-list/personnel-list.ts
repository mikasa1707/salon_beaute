import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar';
import { PageHeaderComponent } from "../../../shared/components/page-header/page-header";
import { DataTableComponent } from "../../../shared/components/data-table/data-table";
import { Personnel } from '../../../core/models/personnel';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog';
import { ModalComponent } from "../../../shared/components/modal/modal";
import { ToastService } from '../../../core/services/toast';
import { PaginationComponent } from "../../../shared/components/pagination/pagination";
import { PersonnelForm } from '../personnel-form/personnel-form';
import { PersonnelApi } from '../../../core/services/personnel-api';
import { TableColumn } from '../../../core/models/table-column';

@Component({
  selector: 'app-personnel-list',
  standalone: true,
  imports: [
    CommonModule,
    SearchBarComponent,
    PageHeaderComponent,
    DataTableComponent,
    ModalComponent,
    PersonnelForm,
    PaginationComponent
  ],
  templateUrl: './personnel-list.html',
  styleUrl: './personnel-list.scss',
})
export class PersonnelList implements OnInit {

  personnels: Personnel[] = [];
  page = 1;
  limit = 10;
  total = 0;
  totalPages = 0;
  searchValue = '';
  loading: boolean = false;
  showModal = false;
  selected?: Personnel;

  columns: TableColumn[] = [
    { field: 'nomComplet', label: 'Nom Prénom' },
    { field: 'telephone', label: 'Téléphone' },
    { field: 'email', label: 'Email' },
    { field: 'role', label: 'Rôle' },
    { field: 'couleurAgenda', label: 'Couleur', type: 'color' }
  ];

  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;
  private confirm = inject(ConfirmDialogService);

  constructor(private readonly personnelService: PersonnelApi, private cdr: ChangeDetectorRef, private toast: ToastService) { }

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(600),
      distinctUntilChanged()
    ).subscribe(value => {
      this.searchValue = value;
      console.log(value)
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
    this.personnelService.findAll(this.page, this.limit, _search).subscribe({
      next: (res: { data: any[]; totalPages: number; total: number; }) => {
        console.log(res)
        this.personnels = res.data;
        this.total = res.total;
        this.totalPages = res.totalPages;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des personnels:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
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
      title: 'Suppression personnel',
      message: 'Le personnel sera archivé mais son historique sera conservé.',
      confirmText: 'Archiver',
      confirmClass: 'btn-danger'
    });

    if (!ok) return;

    this.personnelService.remove(id).subscribe(() => {
      this.toast.error('Personnel archiver');
      this.load();
    });
  }

  openCreate() {
    this.selected = undefined;
    this.showModal = true;
  }

  openEdit(personnel: Personnel) {
    console.log(personnel)
    this.selected = personnel;
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