import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrestationProduitApi } from '../../../core/services/prestation-produit-api';
import { ProduitUniteApi } from '../../../core/services/produit-unite-api';
import { EntityPicker } from '../../../shared/components/entity-picker/entity-picker';
import { EntityPickerConfig } from '../../../shared/components/entity-picker/entity-picker.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { DataTableComponent } from '../../../shared/components/data-table/data-table';
import { ToastService } from '../../../core/services/toast';

@Component({
  selector: 'app-transfert-produit',
  standalone: true,
  imports: [CommonModule, FormsModule, EntityPicker, PageHeaderComponent, DataTableComponent],
  templateUrl: './transfert-produit.html',
})
export class TransfertProduit implements OnInit {
  unites: any[] = [];
  stockPrestations: any[] = [];
  selectedUnite: any = null;
  quantite = 1;
  selectedUniteList: any[] = [];
  unitePickerConfig!: EntityPickerConfig;

  page = 1;
  limit = 5;
  total = 0;
  totalPages = 0;

  pagePP = 1;
  limitPP = 5;
  totalPP = 0;
  totalPagesPP = 0;

  columns: any = [
    {
      field: 'nomComplet',
      label: 'Produit',
    },
    {
      field: 'uniteLabel',
      label: 'Unité',
    },
    {
      field: 'stock',
      label: 'Stock',
      type: 'badge',
    },
  ];

  columnsPP: any = [
    {
      field: 'produit.nom',
      label: 'Produit',
    },
    {
      field: 'unite.unite',
      label: 'Unité',
    },
    {
      field: 'quantite',
      label: 'Stock',
      type: 'badge',
    },
  ];

  constructor(
    private readonly produituniteService: ProduitUniteApi,
    private api: PrestationProduitApi,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.unitePickerConfig = {
      title: 'Choisir une unité produit',
      service: this.produituniteService,
      columns: this.columns,
      multiple: false,
    };
    this.load();
  }

  getValue(row: any, field: string) {
    return field.split('.').reduce((obj, key) => obj?.[key], row);
  }

  load() {
    this.produituniteService.findAll(this.page, this.limit, '').subscribe((res: any) => {
      this.unites = res.data.filter((u: { produit: any }) => u.produit);
      this.total = res.total;
      this.totalPages = res.totalPages;
      this.cdr.detectChanges();
    });
    this.api.findAll(this.page, this.limit, '').subscribe((res: any) => {
      this.stockPrestations = res.data;
      this.totalPP = res.total;
      this.totalPagesPP = res.totalPages;
      this.cdr.detectChanges();
    });
  }

  transfer() {
    if (!this.selectedUnite || this.quantite <= 0) {
      return;
    }

    if (this.quantite > this.selectedUnite.stock) {
      this.toastService.error('Quantité supérieure au stock disponible');
      return;
    }

    this.api
      .transfer({
        produitUniteId: this.selectedUnite.id,
        quantite: this.quantite,
      })
      .subscribe({
        next: () => {
          this.toastService.success('Transfert effectué avec succès');

          this.selectedUnite = null;
          this.selectedUniteList = [];
          this.quantite = 1;

          this.load();
        },
        error: err => {
          console.error('Erreur transfert', err);
          this.toastService.error(err.error?.message ?? 'Erreur lors du transfert');
        },
      });
  }

  onUniteSelected(event: any[]) {
    this.selectedUnite = event.length ? event[0] : null;
    if (this.selectedUnite) {
      this.quantite = 1;
    }
  }

  changePage(page: number) {
    this.page = page;
    this.load();
  }

  changeLimit(newLimit: number) {
    this.limit = newLimit;
    this.page = 1; // 💡 Sécurité : On revient à la page 1 si la taille d'affichage change
    this.load();
  }
}
