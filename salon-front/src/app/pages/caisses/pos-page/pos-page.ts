import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { VentesApi } from '../../../core/services/vente-api';
import { CashRegisterApi } from '../../../core/services/cash-register-api';

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
export class PosPage implements OnInit, OnDestroy {
  cart: VenteProduit[] = [];
  produits: VenteProduit[] = [];
  page = 1;
  limit = 24;
  total = 0;
  totalPages = 0;
  searchValue = '';
  filterValue: any[] = [];

  loading = false;

  factureId: number = 0;
  venteId = 0;

  mode: 'FACTURE' | 'VENTE' = 'FACTURE';

  typesProduit: TypeProduit[] = [];

  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  paymentVisible = false;
  cashOpen = false;
  checkingCash = true;

  constructor(
    private readonly factureService: FacturationApiService,
    private readonly produitService: ProduitUniteApi,
    private readonly typeProduitService: TypeProduitApi,
    public readonly posService: PosService,
    public readonly venteService: VentesApi,
    private readonly checkoutService: CheckoutApi,
    private readonly cdr: ChangeDetectorRef,
    private readonly toastService: ToastService,
    private readonly cashApi: CashRegisterApi,
    private readonly router: Router
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
    this.checkCashSession();
    // this.loadFromNavigation();
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  checkCashSession() {
    this.checkingCash = true;

    this.cashApi.current().subscribe({
      next: cash => {
        this.cashOpen = !!cash && cash.status === 'OPEN';

        this.checkingCash = false;

        if (this.cashOpen) {
          this.loadFromNavigation();
        }

        if (!this.cashOpen) {
          this.toastService.warning('La caisse est fermée. Veuillez ouvrir une session avant de vendre.');
        }

        this.cdr.detectChanges();
      },

      error: () => {
        this.cashOpen = false;
        this.checkingCash = false;

        this.toastService.error('Impossible de vérifier la session caisse');
      },
    });
  }

  loadProduit(_search: any = '', _filter: any = null) {
    this.produitService.findAll(this.page, this.limit, _search, true, _filter).subscribe({
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

  private generateNumeroVente(id: number, _date: Date): string {
    const d = new Date(_date);
    const date = d.getFullYear().toString().slice(2) + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
    const prefix = `V${date}`;
    return `${prefix}-${id.toString().padStart(4, '0')}`;
  }

  loadFromNavigation() {
    if (!this.cashOpen) {
      this.toastService.warning('Impossible de charger une vente. La caisse est fermée.');

      return;
    }
    const state = history.state;

    if (state?.vente && state?.mode === 'VENTE_EDIT') {
      state.vente.reste = Number(state.vente.total) - Number(state.vente.montantPaye ?? 0);

      const existing = this.posService.findTicketByVente(state.vente.numero);

      if (existing) {
        this.posService.setActive(existing.id);
        this.toastService.warning(`La vente ${state.vente.numero} est déjà ouverte dans la caisse`);
        history.replaceState({}, '');
      } else {
        this.posService.loadVente(state.vente);
        history.replaceState({}, '');
        return;
      }
    }

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
    if (!this.cashOpen) {
      this.toastService.warning('Impossible de charger une facture. La caisse est fermée.');

      return;
    }
    this.loading = true;

    this.factureService.findOne(id).subscribe({
      next: facture => {
        // Vérification facture déjà transformée en vente
        if (facture.vente && facture.vente.montantPaye === facture.vente.total) {
          this.toastService.warning(`Cette facture est déjà encaissée (Vente N° ${this.generateNumeroVente(facture.vente.id, facture.vente.created_at)})`);

          this.loading = false;
          this.router.navigateByUrl('/facturations');
          return;
        }
        console.log(facture);

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
    if (!this.cashOpen) {
      this.toastService.warning('Impossible de vendre. La caisse est fermée.');

      return;
    }

    this.posService.addItem(product);
    this.cdr.detectChanges();
  }

  filterType(filters: any[]) {
    this.filterValue = filters;
    this.page = 1;
    this.loadProduit(
      '',
      filters.map(x => x.id)
    );
  }

  openPayment() {
    if (!this.cashOpen) {
      this.toastService.warning('Veuillez ouvrir la caisse avant encaissement.');

      return;
    }
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

    const reste = Math.max(ticket.total - (ticket.montantPaye ?? 0), 0);

    if (!this.canPartialPayment && result.montantRecu < reste) {
      this.toastService.warning('Un paiement partiel nécessite un client.');
      return;
    }

    const nouveauPaiement = Math.min(result.montantRecu, reste);
    const totalPaye = Number(ticket.montantPaye ?? 0) + nouveauPaiement;
    const paiementComplet = totalPaye >= Number(ticket.total);

    const items = ticket.items.map(i => ({
      label: i.label,
      quantite: i.quantite,
      prix: i.prix,
      produitUnite: i.produitUnite?.id ? { id: i.produitUnite.id } : undefined,
      prestation: i.prestation?.id ? { id: i.prestation.id } : undefined,
    }));

    const payload = {
      ticketId: ticket.id,
      factureId: ticket.facturation?.id,
      venteId: ticket.venteId,
      total: ticket.total,
      remise: ticket.remise ?? 0,
      items,
      paiement: {
        modePaiement: result.modePaiement,
        montant: nouveauPaiement,
        montantrecu: result.montantRecu,
        montantrendu: result.monnaie ?? 0,
        referencePaiement: result.referencePaiement,
        numeroPaiement: result.numeroPaiement,
      },
      paiementComplet,
    };

    this.checkoutService.checkoutPos(payload).subscribe({
      next: vente => {
        this.toastService.success(paiementComplet ? 'Paiement complet - Vente validée' : 'Paiement enregistré');

        this.posService.removeTicket(ticket.id);

        this.paymentVisible = false;
        this.loadProduit(this.searchValue);
      },

      error: err => {
        this.toastService.error(err.error?.message ?? 'Erreur Paiement');
      },
    });
  }

  get canPartialPayment(): boolean {
    const ticket = this.posService.activeTicket;

    if (!ticket) {
      return false;
    }

    return !!ticket.client || !!ticket.facturation;
  }
}
