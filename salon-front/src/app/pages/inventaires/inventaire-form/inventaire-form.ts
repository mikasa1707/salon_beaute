import { ChangeDetectorRef, Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InventaireApi } from '../../../core/services/inventaire-api';
import { ProduitUniteApi } from '../../../core/services/produit-unite-api';

import { EntityPicker } from '../../../shared/components/entity-picker/entity-picker';
import { EntityPickerConfig } from '../../../shared/components/entity-picker/entity-picker.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';

interface InventaireLigne {
  produitUniteId: number;
  produitNom: string;
  unite: string;
  stockTheorique: number;
  stockReel: number;
}

@Component({
  selector: 'app-inventaire-form',

  standalone: true,

  imports: [CommonModule, FormsModule, EntityPicker, PageHeaderComponent],

  templateUrl: './inventaire-form.html',
})
export class InventaireForm implements OnInit {
  @Input() showPicker = false;
  @Input() inventaire: any | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  reference = 'INVENTAIRE-' + Date.now();
  note = '';

  /**
   * Source unique
   */
  lignesCache: Record<number, InventaireLigne> = {};
  lignes: InventaireLigne[] = [];
  pickerConfig!: EntityPickerConfig;

  constructor(
    private api: InventaireApi,
    private produitApi: ProduitUniteApi,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.pickerConfig = {
      title: 'Ajouter produits inventaire',
      columns: [
        { field: 'produit.nom', label: 'Produit' },
        { field: 'nom', label: 'Unité' },
        { field: 'stock', label: 'Stock' },
      ],
      service: this.produitApi,
      excludeIds: this.selectedIds,
      multiple: true,
      labelField: 'label',
    };
    if (this.inventaire) {
      this.loadInventaire();
    }
  }

  /**
   * IDs déjà sélectionnés
   */
  get selectedIds(): number[] {
    return Object.keys(this.lignesCache).map(id => Number(id));
  }

  /**
   * Sélection EntityPicker
   */
  selectedProduits(items: any[]) {
    for (const produit of items) {
      if (this.lignesCache[produit.id]) {
        continue;
      }

      this.lignesCache[produit.id] = {
        produitUniteId: produit.id,
        produitNom: produit.produit.nom,
        unite: produit.nom,
        stockTheorique: produit.stock,
        stockReel: produit.stock,
      };
    }

    this.showPicker = false;
    this.refreshLignes();
    this.showPicker = true;
  }

  refreshLignes() {
    this.lignes = Object.values(this.lignesCache);
    this.pickerConfig.excludeIds = this.selectedIds;
    this.cdr.detectChanges();
  }

  remove(index: number) {
    const ligne = this.lignes[index];

    if (!ligne) {
      return;
    }
    delete this.lignesCache[ligne.produitUniteId];
    this.refreshLignes();
  }

  save() {
    const dto = {
      reference: this.reference,
      note: this.note,
      lignes: this.lignes.map(x => ({
        produitUniteId: x.produitUniteId,
        stockReel: x.stockReel,
      })),
    };

    if (this.inventaire) {
      this.api.update(this.inventaire.id, dto).subscribe(() => {
        this.saved.emit();
        this.close.emit();
      });
    } else {
      this.api.create(dto).subscribe(() => {
        this.saved.emit();
        this.close.emit();
      });
    }
  }

  loadInventaire() {
    this.reference = this.inventaire.reference;
    this.note = this.inventaire.note;

    this.lignesCache = {};

    for (const ligne of this.inventaire.lignes) {
      this.lignesCache[ligne.produitUnite.id] = {
        produitUniteId: ligne.produitUnite.id,
        produitNom: ligne.produitUnite.produit.nom,
        unite: ligne.produitUnite.nom,
        stockTheorique: ligne.stockTheorique,
        stockReel: ligne.stockReel,
      };
    }

    this.refreshLignes();
  }
}
