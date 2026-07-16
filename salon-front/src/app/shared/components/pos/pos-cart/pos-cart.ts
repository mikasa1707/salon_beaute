import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PosService } from '../../../../core/services/pos';
import { VenteProduit } from '../../../../core/models/vente-produit';

@Component({
  selector: 'app-pos-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pos-cart.html',
  styleUrl: './pos-cart.scss',
})
export class PosCartComponent {
  cart: VenteProduit[] = [];

  constructor(private readonly posService: PosService) {}

  ngOnInit() {
    this.posService.cart$.subscribe(cart => {
      this.cart = cart;
    });
  }

  remove(item: VenteProduit) {
    if (item.locked) {
      return;
    }

    this.posService.removeItem(item.id);
  }

  increase(item: VenteProduit) {
    if (item.locked) {
      return;
    }

    this.posService.updateQuantity(item.id, item.quantite + 1);
  }

  decrease(item: VenteProduit) {
    if (item.locked) {
      return;
    }

    if (item.quantite <= 1) {
      return;
    }

    this.posService.updateQuantity(item.id, item.quantite - 1);
  }
}
