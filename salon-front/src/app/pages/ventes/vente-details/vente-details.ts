import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { CommonModule } from '@angular/common';

import { Vente } from '../../../core/models/vente';
import { TableColumn } from '../../../core/models/table-column';

import { DataTableComponent } from '../../../shared/components/data-table/data-table';

import { Router } from '@angular/router';

@Component({
  selector: 'app-vente-details',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './vente-details.html',
})
export class VenteDetails implements OnChanges {
  @Input()
  vente?: any= null;

  produits: any[] = [];

  prestations: any[] = [];

  paiements: any[] = [];

  produitColumns: TableColumn[] = [
    {
      field: 'produitUnite.produit.nom',
      label: 'Produit',
    },

    {
      field: 'produitUnite.nom',
      label: 'Unité',
    },

    {
      field: 'quantite',
      label: 'Qté',
    },

    {
      field: 'prix',
      label: 'Prix',
      type: 'currency',
    },

    {
      field: 'total',
      label: 'Total',
      type: 'currency',
    },
  ];

  prestationColumns: TableColumn[] = [
    {
      field: 'prestation.nom',
      label: 'Prestation',
    },

    {
      field: 'quantite',
      label: 'Qté',
    },

    {
      field: 'prix',
      label: 'Prix',
      type: 'currency',
    },

    {
      field: 'total',
      label: 'Total',
      type: 'currency',
    },
  ];

  paiementColumns: TableColumn[] = [
    {
      field: 'date',
      label: 'Date',
      type: 'date',
    },

    {
      field: 'montant',
      label: 'Montant',
      type: 'currency',
    },

    {
      field: 'mode',
      label: 'Mode',
    },

    {
      field: 'reference',
      label: 'Référence',
    },
  ];

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.vente) {
      this.prepareDetails();
    }
  }

  prepareDetails() {
    const lignes = this.vente?.produits ?? [];

    this.produits = lignes.filter(x => x.produit);

    this.prestations = lignes.filter(x => x.prestation);

    this.paiements = this.vente?.paiements ?? [];

    this.cdr.detectChanges();
  }

  modifier() {
    if (!this.vente) return;

    /*
      Modification interdite ici.

      On retourne vers POS
      avec la vente chargée.
    */

    this.router.navigate(['/caisse'], {
      state: {
        venteId: this.vente.id,
        mode: 'EDIT',
      },
    });
  }

  archiver() {
    /*
       A brancher avec ton ConfirmDialogService

       Demande mot de passe
       Puis API archive
       Puis refresh liste
    */
  }
}
