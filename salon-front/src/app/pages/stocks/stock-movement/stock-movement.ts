import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Stock } from '../../../core/models/stock';
import { TableColumn } from '../../../core/models/table-column';
import { StockApi } from '../../../core/services/stock-api';
import { PageHeaderComponent } from "../../../shared/components/page-header/page-header";
import { DataTableComponent } from "../../../shared/components/data-table/data-table";
import { SearchBarComponent } from "../../../shared/components/search-bar/search-bar";

@Component({
  selector: 'app-stock-movement',
  imports: [PageHeaderComponent, DataTableComponent, SearchBarComponent],
  templateUrl: './stock-movement.html',
  styleUrl: './stock-movement.scss',
})
export class StockMovement implements OnInit{
  stocks: Stock[] = [];

  loading = false;

  columns: TableColumn[] = [
    {
      field: 'created_at',
      label: 'Date',
      type: 'date',
    },

    {
      field: 'produitUnite.produit.nom',
      label: 'Produit',
    },

    {
      field: 'produitUnite.nom',
      label: 'Unité',
    },

    {
      field: 'type',
      label: 'Type',
      type: 'badge',
    },

    {
      field: 'quantite',
      label: 'Quantité',
    },

    {
      field: 'reference',
      label: 'Référence',
    },
  ];

  constructor(
    private stockApi: StockApi,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;

    this.stockApi.findAll().subscribe({
      next: res => {
        this.stocks = res.data;
        this.loading = false;
        this.cdr.detectChanges();
      },

      error: () => {
        this.loading = false;
      },
    });
  }
}
