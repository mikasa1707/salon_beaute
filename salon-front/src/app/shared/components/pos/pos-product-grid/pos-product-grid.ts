import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VenteProduit } from '../../../../core/models/vente-produit';

@Component({
  selector: 'app-pos-product-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pos-product-grid.html',
  styleUrl: './pos-product-grid.scss',
})
export class PosProductGridComponent {
  @Input() products: VenteProduit[] = [];

  @Output() selected = new EventEmitter<VenteProduit>();

  selectProduct(product: VenteProduit) {
    this.selected.emit(product);
  }
}
