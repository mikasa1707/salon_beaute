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

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    CommonModule,
    SearchBarComponent,
    PageHeaderComponent,
    DataTableComponent,
    ModalComponent
],
  templateUrl: './client-list.html',
  styleUrl: './client-list.scss',
})
export class ClientList implements OnInit {

  clients: Client[] = [];
  page = 1;
  totalPages = 1;
  searchValue = '';
  loading: boolean = false;
  showModal = false;

  columns = [
    { field: 'nom', label: 'Nom' },
    { field: 'prenom', label: 'Prénom' },
    { field: 'telephone', label: 'Téléphone' },
    { field: 'email', label: 'Email' }
  ];

  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;
  private confirm = inject(ConfirmDialogService);

  constructor(private readonly clientService: ClientService, private cdr: ChangeDetectorRef) { }

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
    this.clientService.findAll(this.page, 10, _search).subscribe({
      next: (res: { data: any[]; totalPages: number; }) => {
        console.log(res.data)
        this.clients = res.data;
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

  search(value: string) {
    const text = value.toLowerCase().trim();
    this.searchSubject.next(text);
  }

  view(client: Client) {
    // this.router.navigate(['/clients', client.id]);
  }

  edit(client: Client) {
    // this.router.navigate(['/clients', client.id]);
  }

  async delete(id: number) {
    console.log(id)
    const ok = await this.confirm.confirm({
      title: 'Suppression client',
      message: 'Le client sera archivé mais son historique sera conservé.',
      confirmText: 'Archiver',
      confirmClass: 'btn-danger'
    });

    if (!ok) return;

    this.clientService.remove(id).subscribe(() => {
      this.loadClients();
    });
  }

  openCreate() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}