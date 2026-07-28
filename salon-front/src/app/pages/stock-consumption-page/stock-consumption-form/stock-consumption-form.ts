import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProduitUnite } from '../../../core/models/produit-unite';
import { ProduitUniteApi } from '../../../core/services/produit-unite-api';
import { ToastService } from '../../../core/services/toast';
import { StockProductGrid } from '../../../shared/components/stock/stock-product-grid/stock-product-grid';
import { StockCart } from '../../../shared/components/stock/stock-cart/stock-cart';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { StockConsumptionApi } from '../../../core/services/stock-consumption-api.ts';
import { StockConsumption } from '../../../core/models/stock-consumption';

@Component({
  selector: 'app-stock-consumption-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, StockProductGrid, StockCart, PaginationComponent],
  templateUrl: './stock-consumption-form.html',
})
export class StockConsumptionForm implements OnInit {
  @Output() saved = new EventEmitter<any>();

  @Output() cancel = new EventEmitter<void>();

  @Input() editData?: StockConsumption;

  form!: FormGroup;
  loading = false;
  produitUnites: ProduitUnite[] = [];
  cart: ProduitUnite[] = [];
  page = 1;
  limit = 12;
  total = 0;
  totalPages = 0;
  searchValue = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly produitUniteApi: ProduitUniteApi,
    private readonly api: StockConsumptionApi,
    private readonly toast: ToastService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      motif: ['', Validators.required],
    });

    this.loadProduits();
  }

  loadProduits() {
    this.produitUniteApi.findAllNoneCommerce(this.page, this.limit, this.searchValue).subscribe({
      next: res => {
        this.produitUnites = res.data;
        this.total = res.total;
        this.totalPages = res.totalPages;
        if (this.editData) {
          this.initEdit();
        }
        this.cdr.detectChanges();
      },
    });
  }

  initEdit() {
    if (!this.editData) {
      return;
    }

    this.form.patchValue({
      motif: this.editData.motif,
    });

    this.cart = this.editData.items.map(item => ({
      id: item.produitUnite.id,
      nom: item.produitUnite.nom,
      code: item.produitUnite.code,
      conversion: item.produitUnite.conversion,
      uniteMesure: item.produitUnite.uniteMesure,
      stock: item.produitUnite.stock,
      prix: item.produitUnite.prix,
      stock_minimum: item.produitUnite.stock_minimum,
      couleur: item.produitUnite.couleur,
      actif: true,
      produit_id: item.produitUnite.produit_id,
      unite_mesure_id: item.produitUnite.unite_mesure_id,
      unites: item.produitUnite.unites,
      produit: item.produitUnite.produit,
      quantite: item.quantite,
    }));

    // IMPORTANT
    // clone pour déclencher Angular
    this.cart = [...this.cart];
  }

  search(value: string) {
    this.searchValue = value;
    this.page = 1;
    this.loadProduits();
  }

  changePage(page: number) {
    this.page = page;
    this.loadProduits();
  }

  changeLimit(limit: number) {
    this.limit = limit;
    this.page = 1;
    this.loadProduits();
  }

  addProduct(product: ProduitUnite) {
    const exist = this.cart.find(x => x.id === product.id);

    if (exist) {
      const current = exist.quantite ?? 0;

      if (current >= product.stock) {
        this.toast.warning(`Stock maximum atteint pour ${product.nom}`);
        return;
      }

      exist.quantite = current + 1;
      this.cart = [...this.cart];
      return;
    }

    this.cart = [
      ...this.cart,
      {
        ...product,
        quantite: 1,
      },
    ];
  }

  removeProduct(item: ProduitUnite) {
    this.cart = this.cart.filter(x => x.id !== item.id);
  }

  quantityChanged() {
    this.cart = [...this.cart];
  }

  submit() {
    if (this.form.invalid || this.cart.length === 0) {
      this.form.markAllAsTouched();

      return;
    }

    this.loading = true;

    const payload = {
      motif: this.form.value.motif,
      items: this.cart.map(item => ({
        produitUniteId: item.id,
        quantite: Number(item.quantite ?? 0),
      })),
    };

    const request = this.editData ? this.api.update(this.editData.id, payload) : this.api.create(payload);
    request.subscribe({
      next: res => {
        this.toast.success(this.editData ? 'Consommation modifiée' : 'Consommation enregistrée');
        this.cart = [];
        this.form.reset();
        this.saved.emit(res);
      },
      error: () => {
        this.toast.error('Erreur sauvegarde consommation');
      },
    });
  }
}
