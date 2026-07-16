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

  typesProduit = [
    {
      id: 1,
      label: 'Shampoing',
    },
    {
      id: 2,
      label: 'Soin',
    },
  ];

  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  constructor(
    private readonly factureService: FacturationApiService,
    private readonly produitService: ProduitUniteApi,
    private readonly posService: PosService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.searchSubscription = this.searchSubject.pipe(debounceTime(600), distinctUntilChanged()).subscribe(value => {
      this.searchValue = value;
      console.log(value);
      this.page = 1;
      this.loadProduit(value);
    });
    this.posService.cart$.subscribe(cart => {
      this.cart = cart;
      console.log(cart);
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
        console.log(this.produits)
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

      this.loadFacture(this.factureId);
    }
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
    this.posService.addItem(product);
  }

  openPayment() {
    console.log('Ouverture paiement');
  }

  filterType(filters: any[]) {
    console.log(filters);

    this.loadProduit(
      '',
      filters.map(x => x.id)
    );
  }
}
