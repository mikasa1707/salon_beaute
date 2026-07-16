import { ChangeDetectorRef, Component } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';

import { Facturation } from '../../../core/models/facturation';
import { ToastService } from '../../../core/services/toast';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog';
import { FacturationApiService } from '../../../core/services/facturation-api';

import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar';
import { DataTableComponent } from '../../../shared/components/data-table/data-table';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { FacturePrintModal } from '../../../shared/components/facture-print-modal/facture-print-modal';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-facturation-list',
  standalone: true,
  imports: [PageHeaderComponent, SearchBarComponent, DataTableComponent, PaginationComponent, FacturePrintModal],
  templateUrl: './facturation-list.html',
  styleUrl: './facturation-list.scss',
})
export class FacturationList {
  facturations: Facturation[] = [];

  page = 1;
  limit = 10;
  total = 0;
  totalPages = 0;
  loading = false;
  selectedFacture?: Facturation;
  showPrintModal = false;

  columns = [
    { field: 'numero', label: 'N° Facture' },
    { field: 'date_facture', label: 'Date' },
    { field: 'nom', label: 'Client' },
    { field: 'status', label: 'Statut' },
    { field: 'total', label: 'Prix' },
  ];

  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  constructor(
    private readonly facturationService: FacturationApiService,
    private readonly cdr: ChangeDetectorRef,
    private readonly toast: ToastService,
    private readonly confirm: ConfirmDialogService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.searchSubscription = this.searchSubject.pipe(debounceTime(600), distinctUntilChanged()).subscribe(value => {
      this.page = 1;
      this.load(value);
    });

    this.load();
  }

  ngOnDestroy() {
    this.searchSubscription?.unsubscribe();
  }

  load(search = '') {
    this.loading = true;

    this.facturationService.findAll(this.page, this.limit, search).subscribe({
      next: res => {
        this.facturations = res.data;
        this.total = res.total;
        this.totalPages = res.totalPages;
        this.loading = false;
        this.cdr.detectChanges();
      },

      error: err => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  changePage(page: number) {
    this.page = page;

    this.load();
  }

  changeLimit(limit: number) {
    this.limit = limit;
    this.page = 1;
    this.load();
  }

  search(value: string) {
    this.searchSubject.next(value.toLowerCase().trim());
  }

  async delete(id: number) {
    const ok = await this.confirm.confirm({
      title: 'Suppression facture',
      message: 'La facture sera archivée mais son historique sera conservé.',
      confirmText: 'Archiver',
      confirmClass: 'btn-danger',
    });

    if (!ok) return;

    this.facturationService.remove(id).subscribe(() => {
      this.toast.error('Facture archivée');
      this.load();
    });
  }

  openPrint(facture: Facturation) {
    this.facturationService.findOne(facture.id).subscribe({
      next: data => {
        this.selectedFacture = data;
        this.showPrintModal = true;
        this.cdr.detectChanges();
      },

      error: err => {
        console.error(err);
      },
    });
  }

  closePrintModal() {
    this.showPrintModal = false;
    // On attend que le modal soit fermé avant de vider
    setTimeout(() => {
      this.selectedFacture = undefined;
    }, 200);
  }

  sendToCashier(facture: Facturation) {
    console.log('Envoyer en caisse', facture);
    this.router.navigate(['/caisse'], {
      state: {
        facturationId: facture.id,
      },
    });
  }
}
