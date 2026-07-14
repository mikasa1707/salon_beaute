import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reservation-consumption',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './reservation-consumption.html'
})
export class ReservationConsumptionComponent {

  @Input() reservation: any;

  @Output() confirmed = new EventEmitter<any[]>();

  availableProducts: any[] = [];
  selectedProducts: any[] = [];

  ngOnChanges() {
    if (this.reservation) {
      this.availableProducts =
        this.reservation.prestations
          ?.flatMap((p: any) =>
            p.prestation.produitsUtilises ?? []
          ) ?? [];
    }
  }

  add(product: any) {
    const exist =
      this.selectedProducts.find(
        x => x.prestationProduitId === product.id
      );

    if (exist) {
      exist.quantite++;
    } else {
      this.selectedProducts.push({
        prestationProduitId: product.id,
        quantite: 1,
        produit: product
      });
    }
  }

  remove(product: any) {
    this.selectedProducts =
      this.selectedProducts.filter(
        x => x !== product
      );
  }

  save() {
    this.confirmed.emit(
      this.selectedProducts.map(p => ({
        prestationProduitId: p.prestationProduitId,
        quantite: p.quantite
      }))
    );
  }
}