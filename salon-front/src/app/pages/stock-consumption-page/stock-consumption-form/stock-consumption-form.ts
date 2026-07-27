import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormField } from '../../../core/models/form-field';
import { ProduitUniteApi } from '../../../core/services/produit-unite-api';
import { ToastService } from '../../../core/services/toast';
import { ProduitUnite } from '../../../core/models/produit-unite';
import { StockConsumptionApi } from '../../../core/services/stock-consumption-api.ts';
import { PosCartComponent } from '../../../shared/components/pos/pos-cart/pos-cart';
import { CommonModule } from '@angular/common';
import { VenteProduit } from '../../../core/models/vente-produit';
import { StockProductGrid } from '../../../shared/components/stock/stock-product-grid/stock-product-grid';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-stock-consumption-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PosCartComponent, StockProductGrid, PaginationComponent],
  templateUrl: './stock-consumption-form.html',
})
export class StockConsumptionForm implements OnInit {
  @Output()
  saved = new EventEmitter<any>();

  @Output()
  cancel = new EventEmitter<void>();

  form!: FormGroup;
  fields: FormField[] = [];
  loading = false;
  page = 1;
  limit = 12;
  total = 0;
  totalPages = 0;
  produitUnites: ProduitUnite[] = [];
  items: ProduitUnite[] = [];
  cart: VenteProduit[] = [];

  search = '';
  selectedProduit?: ProduitUnite;

  constructor(
    private readonly fb: FormBuilder,
    private readonly produitUniteApi: ProduitUniteApi,
    private readonly api: StockConsumptionApi,
    private readonly toast: ToastService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      motif: ['', Validators.required],
    });

    this.loadProduits();
  }

  selectProduit(produit: ProduitUnite) {
    this.selectedProduit = produit;

    this.form.patchValue({
      produit_unite_id: produit.id,
    });
  }

  isSelected(id: number) {
    return this.selectedProduit?.id === id;
  }

  loadProduits() {
    this.produitUniteApi.findAll(this.page, this.limit, this.search, false).subscribe(res => {
      this.produitUnites = res.data;
      this.total = res.total;
      this.totalPages = res.totalPages;

      this.cdr.detectChanges();
    });
  }

  initFields() {
    this.fields = [
      {
        key: 'produit_unite_id',
        label: 'Produit',
        type: 'select',
        required: true,
        options: this.produitUnites,
        optionLabel: 'nom',
        optionValue: 'id',
      },

      {
        key: 'quantite',
        label: 'Quantité',
        type: 'number',
        required: true,
      },

      {
        key: 'motif',
        label: 'Motif',
        type: 'textarea',
        required: true,
      },
    ];
  }

  changePage(page: number) {
    this.page = page;
    this.loadProduits();
  }

  changeLimit(newLimit: number) {
    this.limit = newLimit;
    this.page = 1; // 💡 Sécurité : On revient à la page 1 si la taille d'affichage change
    this.loadProduits();
  }

  searchProduit(value: string) {
    this.search = value;

    this.page = 1;

    this.loadProduits();
  }

  removeProduct(id: number) {
    this.cart = this.cart.filter(item => item.produitUnite?.id !== id);
  }

  updateQuantity(event: { item: VenteProduit; quantite: number }) {
    const item = event.item;

    item.quantite = 1;
    if (item.produitUnite && event.quantite > item.produitUnite?.stock) {
      item.quantite = item.produitUnite?.stock;
      return;
    }

    if (event.quantite < 1) {
      item.quantite = 1;
      return;
    }

    item.quantite = event.quantite;

    item.total = Number(item.produitUnite?.prix) * item.quantite;
  }

  submit() {
    if (this.form.invalid || this.cart.length === 0) {
      this.form.markAllAsTouched();

      return;
    }

    this.loading = true;

    const data = {
      motif: this.form.value.motif,

      items: this.cart.map(item => ({
        produitUniteId: item.produitUnite?.id,
        quantite: Number(item.quantite),
      })),
    };

    this.api.create(data).subscribe({
      next: res => {
        this.loading = false;

        this.toast.success('Consommation enregistrée');

        this.cart = [];

        this.form.reset();

        this.saved.emit(res);
      },

      error: () => {
        this.loading = false;

        this.toast.error('Erreur lors de la consommation');
      },
    });
  }

  addProduct(product: ProduitUnite) {
    const exist = this.cart.find(x => x.produitUnite?.id === product.id);

    if (exist) {
      exist.quantite++;
      exist.total = exist.quantite * Number(exist.prix);
      return;
    }

    this.cart.push({
      produitUnite: product,
      label: product.nom,
      prix: product.prix,
      quantite: 1,
      total: Number(product.prix),
    } as VenteProduit);
  }
}
