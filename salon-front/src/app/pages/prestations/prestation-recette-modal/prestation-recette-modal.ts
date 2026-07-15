import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrestationRecetteApi } from '../../../core/services/prestation-recette-api';
import { ProduitApi } from '../../../core/services/produit-api';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { EntityPicker } from '../../../shared/components/entity-picker/entity-picker';
import { DataTableComponent } from '../../../shared/components/data-table/data-table';
import { TableColumn } from '../../../core/models/table-column';
import { ToastService } from '../../../core/services/toast';

@Component({
  selector: 'app-prestation-recette-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, EntityPicker, DataTableComponent],
  templateUrl: './prestation-recette-modal.html',
})
export class PrestationRecetteModal implements OnChanges {
  @Input() show = false;
  @Input() prestation: any;

  @Output() closed = new EventEmitter<void>();

  selectedProduitList: any[] = [];
  tempRecettes: any[] = [];
  recettes: any[] = [];
  quantite = 1;
  pickerConfig: any;
  columns: TableColumn[] = [
    {
      field: 'produit.nom',
      label: 'Produit',
      type: 'text',
    },
    {
      field: 'quantite',
      label: 'Quantité',
      type: 'badge',
    },
    {
      field: 'produit.uniteConsommation.symbole',
      label: 'Unité',
    },
  ];
  columnsTemp: TableColumn[] = [
    {
      field: 'produit.nom',
      label: 'Produit',
      type: 'text',
    },
    {
      field: 'quantite',
      label: 'Quantité',
      type: 'number',
    },
    {
      field: 'produit.uniteConsommation.symbole',
      label: 'Unité',
    },
  ];

  constructor(
    private readonly api: PrestationRecetteApi,
    private readonly produitApi: ProduitApi,
    private readonly cdr: ChangeDetectorRef,
    private readonly toast: ToastService,
  ) {
    this.pickerConfig = {
      title: 'Choisir produit',
      service: this.produitApi,
      columns: [
        {
          field: 'nom',
          label: 'Produit',
          type: 'text',
        },
      ],
      multiple: true,
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['prestation'] && this.prestation) {
      this.reset();
      this.load();
    }
  }

  reset() {
    this.selectedProduitList = [];
    this.quantite = 1;
    this.tempRecettes = [];
  }

  load() {
    this.api.findByPrestation(this.prestation.id).subscribe(res => {
      this.recettes = res;
      this.cdr.detectChanges();
    });
  }

  add() {
    if (!this.selectedProduitList.length || this.quantite <= 0) {
      return;
    }

    this.api
      .create(this.prestation.id, {
        produitId: this.selectedProduitList[0].id,
        quantite: this.quantite,
      })
      .subscribe(() => {
        this.selectedProduitList = [];
        this.quantite = 1;
        this.load();
      });
  }

  delete(id: number) {
    this.api.remove(id).subscribe(() => {
      this.load();
    });
  }

  close() {
    this.closed.emit();
    this.reset();
  }

  produitSelected(event: any[]) {
    event.forEach(produit => {
      const exists = this.tempRecettes.some(x => x.produitId === produit.id);
      if (exists) {
        this.toast.info(`${produit.nom} est déjà présent dans la recette.`);
      } else {
        this.tempRecettes.push({
          produitId: produit.id,
          produit,
          quantite: 1,
        });
      }
    });
    this.selectedProduitList = [...this.tempRecettes.map(x => x.produit)];
    console.log(this.selectedProduitList);
  }

  saveRecette() {
    if (!this.tempRecettes.length) {
      return;
    }

    this.api
      .createBulk(this.prestation.id, {
        produits: this.tempRecettes.map(x => ({
          produitId: x.produitId,
          quantite: x.quantite,
        })),
      })
      .subscribe(() => {
        this.tempRecettes = [];
        this.selectedProduitList = [];
        this.load();
      });
  }

  removeTemp(produitId: number) {
    this.tempRecettes = this.tempRecettes.filter(x => x.produitId !== produitId);
    this.selectedProduitList = this.selectedProduitList.filter(x => x.id !== produitId);
  }
}
