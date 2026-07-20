import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FacturationApiService } from '../../../core/services/facturation-api';
import { PosService } from '../../../core/services/pos';
import { VenteProduit } from '../../../core/models/vente-produit';
import { PosCartComponent } from '../../../shared/components/pos/pos-cart/pos-cart';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { ProduitUniteApi } from '../../../core/services/produit-unite-api';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { PosProductGridComponent } from '../../../shared/components/pos/pos-product-grid/pos-product-grid';
import { PosSummaryComponent } from '../../../shared/components/pos/pos-summary/pos-summary';
import { FilterButtonComponent } from '../../../shared/components/filter-button/filter-button';
import { TypeProduit } from '../../../core/models/type-produit';
import { TypeProduitApi } from '../../../core/services/type-produit-api';
import { PosTicketBar } from '../../../shared/components/pos/pos-ticket-bar/pos-ticket-bar';
import { PaymentResult, PaymentModalComponent } from '../../../shared/components/payment-modal/payment-modal';
import { CheckoutApi } from '../../../core/services/checkout-api';
import { Toast, ToastService } from '../../../core/services/toast';

@Component({
  selector: 'app-pos-page',
  standalone: true,
  imports: [
    PosCartComponent,
    SearchBarComponent,
    PaginationComponent,
    PageHeaderComponent,
    PosProductGridComponent,
    PosSummaryComponent,
    FilterButtonComponent,
    PosTicketBar,
    PaymentModalComponent,
  ],
  templateUrl: './pos-page.html',
  styleUrl: './pos-page.scss',
})
export class PosPage {
  cart: VenteProduit[] = [];
  produits: VenteProduit[] = [];
  page = 1;
  limit = 16;
  total = 0;
  totalPages = 0;
  searchValue = '';

  loading = false;

  factureId: number = 0;

  typesProduit: TypeProduit[] = [];

  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  paymentVisible = false;

  constructor(
    private readonly factureService: FacturationApiService,
    private readonly produitService: ProduitUniteApi,
    private readonly typeProduitService: TypeProduitApi,
    public readonly posService: PosService,
    private readonly checkoutService: CheckoutApi,
    private readonly cdr: ChangeDetectorRef,
    private readonly toastService: ToastService
  ) {}

  ngOnInit() {
    this.searchSubscription = this.searchSubject.pipe(debounceTime(600), distinctUntilChanged()).subscribe(value => {
      this.searchValue = value;
      console.log(value);
      this.page = 1;
      this.loadProduit(value);
    });
    this.posService.activeTicket$.subscribe(ticket => {
      this.cart = ticket?.items ?? [];
      this.cdr.detectChanges();
    });
    this.loadProduit();
    this.loadFromNavigation();
  }

  loadProduit(_search: any = '', _filter: any = null) {
    this.produitService.findAll(this.page, this.limit, _search, _filter).subscribe({
      next: (res: { data: any[]; totalPages: number; total: number }) => {
        this.produits = res.data;
        this.total = res.total;
        this.totalPages = res.totalPages;
        this.typeProduitService.findAll(1, 1000).subscribe({
          next: (res: { data: any[]; totalPages: number; total: number }) => {
            this.typesProduit = res.data;
            this.cdr.detectChanges();
          },
        });
        this.cdr.detectChanges();
      },
    });
  }

  // =====================================
  // Chargement facture depuis réservation
  // =====================================

  loadFromNavigation() {
    const state = history.state;

    if (state?.facturationId) {
      this.factureId = state.facturationId;
      const existing = this.posService.findTicketByFacture(this.factureId);

      if (existing) {
        this.posService.setActive(existing.id);
        history.replaceState({}, '');
        return;
      }
      this.loadFacture(this.factureId);
      history.replaceState({}, '');
    }
  }

  findTicketByFacture(tickets: any, id: number) {
    return tickets.find((t: { facture: { id: number } }) => t.facture?.id === id);
  }

  // =====================================
  // Chargement facture
  // =====================================

  loadFacture(id: number) {
    this.loading = true;

    this.factureService.findOne(id).subscribe({
      next: facture => {
        this.posService.loadFacture(facture);
        this.loading = false;
        this.cdr.detectChanges();
      },

      error: err => {
        console.error('Erreur chargement facture', err);
        this.loading = false;
      },
    });
  }

  changePage(page: number) {
    this.page = page;
    this.loadProduit();
  }

  changeLimit(newLimit: number) {
    this.limit = newLimit;
    this.page = 1; // 💡 Sécurité : On revient à la page 1 si la taille d'affichage change
    this.loadProduit();
  }

  search(value: string) {
    const text = value.toLowerCase().trim();
    this.searchSubject.next(text);
  }

  addToCart(product: VenteProduit) {
    console.log(product);
    this.posService.addItem(product);
    this.cdr.detectChanges();
  }

  filterType(filters: any[]) {
    console.log(filters);
    this.page = 1;
    this.loadProduit(
      '',
      filters.map(x => x.id)
    );
  }

  openPayment() {
    console.log(this.posService.activeTicket);
    if (!this.posService.activeTicket) {
      return;
    }
    if (this.posService.activeTicket.items.length === 0) {
      return;
    }
    this.paymentVisible = true;
  }

  confirmPayment(result: PaymentResult) {
    const ticket = this.posService.activeTicket;

    if (!ticket) {
      console.error('Aucun ticket actif');
      return;
    }

    const payload = {
      ticketId: ticket.id,
      factureId: ticket.facturation?.id || undefined,
      items: ticket.items,
      total: ticket.total,
      remise: ticket.remise,
      paiement: {
        modePaiement: result.modePaiement,
        montant: ticket.total,
        montantrecu: result.montantRecu,
        montantrendu: result.monnaie || 0,
        referencePaiement: result.referencePaiement,
        numeroPaiement: result.numeroPaiement,
      },
    };

    this.checkoutService.checkoutPos(payload).subscribe({
      next: vente => {
        this.toastService.success('Paiement effectuee - Vente OK');
        // supprimer le ticket payé
        this.posService.removeTicket(ticket.id);
        this.paymentVisible = false;
      },

      error: err => {
        this.toastService.warning('Erreur Paiement');
      },
    });
  }
}
