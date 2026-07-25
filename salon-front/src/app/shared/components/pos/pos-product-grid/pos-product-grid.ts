import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VenteProduit } from '../../../../core/models/vente-produit';
import { ToastService } from '../../../../core/services/toast';

@Component({
  selector: 'app-pos-product-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pos-product-grid.html',
  styleUrl: './pos-product-grid.scss',
})
export class PosProductGridComponent {
  @Input() products: VenteProduit[] = [];
  @Input() cart: VenteProduit[] = [];

  @Output() selected = new EventEmitter<VenteProduit>();

  constructor(private readonly toast: ToastService) {}

  selectProduct(product: VenteProduit) {
    const stock = Number(product.stock ?? 0);
    const dejaPanier = this.cart.filter(x => x.id === product.id).reduce((s, x) => s + Number(x.quantite ?? 0), 0);

    console.log(this.cart)
    if (dejaPanier >= stock) {
      this.toast.warning(`Stock insuffisant (${stock} disponible${stock > 1 ? 's' : ''}).`);
      return;
    }

    this.selected.emit(product);
  }
}
