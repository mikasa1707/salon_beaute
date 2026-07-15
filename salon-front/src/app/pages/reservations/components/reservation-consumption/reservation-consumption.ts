import { Component, EventEmitter, Input, Output, OnChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntityPicker } from '../../../../shared/components/entity-picker/entity-picker';
import { EntityPickerConfig } from '../../../../shared/components/entity-picker/entity-picker.model';
import { ProduitApi } from '../../../../core/services/produit-api';
import { PrestationProduitApi } from '../../../../core/services/prestation-produit-api';

@Component({
  selector: 'app-reservation-consumption',
  standalone: true,
  imports: [CommonModule, FormsModule, EntityPicker],
  templateUrl: './reservation-consumption.html',
})
export class ReservationConsumptionComponent implements OnChanges {
  @Input() reservation: any;

  @Output() confirmed = new EventEmitter<any[]>();

  availableProducts: any[] = [];
  selectedProducts: any[] = [];

  selectedProduitList: any[] = [];

  pickerConfig!: EntityPickerConfig;

  constructor(
    private readonly produitApi: PrestationProduitApi,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnChanges() {
    if (!this.reservation) {
      return;
    }

    this.loadRecette();
  }

  ngOnInit() {
    this.pickerConfig = {
      title: 'Ajouter un produit',
      service: this.produitApi,
      columns: [
        {
          field: 'produit.nom',
          label: 'Produit',
        },
      ],
      multiple: false,
    };
  }

  private loadRecette() {
    const recettes: any[] = [];

    console.log(this.reservation);
    this.reservation.prestations?.forEach((item: any) => {
      const produits = item.prestation?.recettes ?? [];
      produits.forEach((recette: any) => {
        const exist = recettes.find(x => x.produitId === recette.produit.id);

        if (exist) {
          exist.quantite = Number(exist.quantite) + Number(recette.quantite);
        } else {
          recettes.push({
            produitId: recette.produit.id,
            produit: recette.produit,
            uniteMesure: recette.produit.uniteConsommation,
            quantite: Number(recette.quantite),
          });
        }
      });
    });

    this.selectedProducts = recettes;
    console.log(recettes);
    this.cdr.detectChanges();
  }

  produitSelected(event: any[]) {
    const produit = event[0];

    if (!produit) {
      return;
    }

    const exist = this.selectedProducts.find(x => x.produitId === produit.id);

    if (exist) {
      exist.quantite = Number(exist.quantite) + 1;
    } else {
      this.selectedProducts.push({
        produitId: produit.produit.id,
        produit: produit.produit,
        uniteMesure: produit.produit.uniteConsommation,
        quantite: 1,
      });
    }
    console.log(this.selectedProducts);

    this.selectedProduitList = [];
  }

  remove(product: any) {
    this.selectedProducts = this.selectedProducts.filter(x => x !== product);
  }

  save() {
    this.confirmed.emit(
      this.selectedProducts.map(p => ({
        produitId: p.produitId,
        quantite: Number(p.quantite),
        uniteMesureId: p.uniteMesure?.id,
      }))
    );
  }

  add(product: any) {
    const produitId = product.produitId ?? product.produit?.id;

    const exist = this.selectedProducts.find(x => x.produitId === produitId);

    if (exist) {
      exist.quantite = Number(exist.quantite) + Number(product.quantite ?? 1);
      return;
    }

    this.selectedProducts.push({
      produitId,
      produit: product.produit ?? product,
      uniteMesure: product.uniteMesure ?? null,
      quantite: Number(product.quantite ?? 1),
    });
  }
}
