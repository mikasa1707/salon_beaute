import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProduitUnite } from '../../../../core/models/produit-unite';
import { ToastService } from '../../../../core/services/toast';

@Component({
  selector: 'app-stock-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stock-cart.html',
  styleUrl: './stock-cart.scss',
})
export class StockCart implements OnChanges {
  @Input() cart: ProduitUnite[] = [];

  @Output() removeItem = new EventEmitter<ProduitUnite>();
  @Output() quantityChanged = new EventEmitter<void>();

  constructor(
    private readonly toast: ToastService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.cart);
  }

  remove(item: ProduitUnite) {
    this.removeItem.emit(item);
  }

  increase(item: ProduitUnite) {
    const quantiteActuelle = item.quantite ?? 0;
    if (quantiteActuelle >= item.stock) {
      this.toast.warning(`Stock insuffisant pour ${item.nom} (disponible : ${item.stock})`);
      return;
    }
    item.quantite = quantiteActuelle + 1;
    this.quantityChanged.emit();
  }

  decrease(item: ProduitUnite) {
    if ((item.quantite ?? 1) <= 1) {
      return;
    }
    item.quantite = (item.quantite ?? 1) - 1;
    this.quantityChanged.emit();
  }
}
