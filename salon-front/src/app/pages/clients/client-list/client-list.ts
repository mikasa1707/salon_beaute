import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar';
import { PageHeaderComponent } from "../../../shared/components/page-header/page-header";
import { DataTableComponent } from "../../../shared/components/data-table/data-table";
import { Client } from '../../../core/models/client';
import { ClientService } from '../../../core/services/client-api';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog';
import { ModalComponent } from "../../../shared/components/modal/modal";
import { ClientForm } from "../client-form/client-form";
import { ToastService } from '../../../core/services/toast';
import { PaginationComponent } from "../../../shared/components/pagination/pagination";

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    CommonModule,
    SearchBarComponent,
    PageHeaderComponent,
    DataTableComponent,
    ModalComponent,
    ClientForm,
    PaginationComponent
],
  templateUrl: './client-list.html',
  styleUrl: './client-list.scss',
})
export class ClientList implements OnInit {

  clients: Client[] = [];
  page = 1;
  limit = 10;
  total = 0;
  totalPages = 0;
  searchValue = '';
  loading: boolean = false;
  showModal = false;
  selected?: Client;

  columns = [
    { field: 'nom', label: 'Nom' },
    { field: 'prenom', label: 'Prénom' },
    { field: 'telephone', label: 'Téléphone' },
    { field: 'email', label: 'Email' }
  ];

  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;
  private confirm = inject(ConfirmDialogService);

  constructor(private readonly clientService: ClientService, private cdr: ChangeDetectorRef, private toast: ToastService) { }

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(600),
      distinctUntilChanged()
    ).subscribe(value => {
      this.searchValue = value;
      console.log(value)
      this.page = 1;
      this.loadClients(value);
    });
    this.loadClients();
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  loadClients(_search: any = '') {
    this.loading = true;
    this.clientService.findAll(this.page, this.limit, _search).subscribe({
      next: (res: { data: any[]; totalPages: number; total: number;}) => {
        console.log(res)
        this.clients = res.data;
        this.total = res.total;
        this.totalPages = res.totalPages;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des clients:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  changePage(page: number) {
    this.page = page;
    this.loadClients();
  }

  changeLimit(newLimit: number) {
    this.limit = newLimit;
    this.page = 1; // 💡 Sécurité : On revient à la page 1 si la taille d'affichage change
    this.loadClients();
  }

  search(value: string) {
    const text = value.toLowerCase().trim();
    this.searchSubject.next(text);
  }

  async delete(id: number) {
    const ok = await this.confirm.confirm({
      title: 'Suppression client',
      message: 'Le client sera archivé mais son historique sera conservé.',
      confirmText: 'Archiver',
      confirmClass: 'btn-danger'
    });

    if (!ok) return;

    this.clientService.remove(id).subscribe(() => {
      this.toast.error('Client archiver');
      this.loadClients();
    });
  }

  openCreate() {
    this.selected = undefined;
    this.showModal = true;
  }

  openEdit(client: Client) {
    this.selected = client;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  save() {
    this.showModal = false;
    this.loadClients();
  }
}