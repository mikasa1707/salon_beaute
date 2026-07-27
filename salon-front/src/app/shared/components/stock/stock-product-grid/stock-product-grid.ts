import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProduitUnite } from '../../../../core/models/produit-unite';

@Component({
  selector: 'app-stock-product-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stock-product-grid.html',
})
export class StockProductGrid {
  @Input()
  produits: ProduitUnite[] = [];

  @Output()
  add = new EventEmitter<ProduitUnite>();
}
