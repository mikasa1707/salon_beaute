import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrestationProduitApi } from '../../../core/services/prestation-produit-api';
import { ProduitUniteApi } from '../../../core/services/produit-unite-api';
import { DataTableSelectable } from '../../../shared/components/data-table-selectable/data-table-selectable';
import { EntityPicker } from '../../../shared/components/entity-picker/entity-picker';
import { EntityPickerConfig } from '../../../shared/components/entity-picker/entity-picker.model';
import { PageHeaderComponent } from "../../../shared/components/page-header/page-header";

@Component({
  selector: 'app-transfert-produit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DataTableSelectable,
    EntityPicker,
    PageHeaderComponent
  ],
  templateUrl: './transfert-produit.html',
})
export class TransfertProduit implements OnInit {
  unites: any[] = [];
  stockPrestations: any[] = [];
  selectedUnite: any = null;
  quantite = 1;
  selectedUniteList: any[] = [];
  unitePickerConfig!: EntityPickerConfig;

  columns = [
    {
      field: 'produit.nom',
      label: 'Produit',
    },
    {
      field: 'unite.nom',
      label: 'Unité',
    },
    {
      field: 'quantite',
      label: 'Stock',
      type: 'badge',
    },
  ];

  constructor(
    private produituniteApi: ProduitUniteApi,
    private api: PrestationProduitApi,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {

    this.unitePickerConfig = {
      title: 'Choisir une unité produit',
      service: this.produituniteApi,
      columns: [
        {
          field: 'nomComplet',
          label: 'Produit',
        },
        {
          field: 'nom',
          label: 'Unité',
        },
        {
          field: 'stock',
          label: 'Stock',
          type: 'badge',
        },
      ],
      multiple: false,
    };
  }

  getValue(row: any, field: string) {
    return field.split('.').reduce((obj, key) => obj?.[key], row);
  }

  load() {
    this.produituniteApi.findUnites()
      .subscribe((res: any) => {
        this.unites = res.data.filter(
          (u: { produit: any; }) => u.produit
        );
        this.cdr.detectChanges();
      });
    this.api.findAll()
      .subscribe(data => {
        this.stockPrestations = data;
        this.cdr.detectChanges();
      });
  }

  transfer() {
    if (!this.selectedUnite || this.quantite <= 0) {
      return;
    }
    this.api.transfer({
      produitUniteId: this.selectedUnite.id,
      quantite: this.quantite,
    }).subscribe(() => {
      this.selectedUnite = null;
      this.quantite = 1;
      this.load();
    });
  }

  onUniteSelected(event: any[]) {
    this.selectedUnite = event.length
      ? event[0]
      : null;
  }
}