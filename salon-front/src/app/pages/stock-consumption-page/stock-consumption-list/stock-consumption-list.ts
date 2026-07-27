import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from '../../../shared/components/data-table/data-table';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar';
import { TableColumn } from '../../../core/models/table-column';
import { StockConsumptionApi } from '../../../core/services/stock-consumption-api.ts';

@Component({
  selector: 'app-stock-consumption-list',
  standalone: true,
  imports: [CommonModule, DataTableComponent, PaginationComponent, SearchBarComponent],
  templateUrl: './stock-consumption-list.html',
})
export class StockConsumptionList implements OnInit, OnChanges {
  @Input()
  refresh = 0;

  data: any[] = [];

  page = 1;
  limit = 10;

  total = 0;
  totalPages = 0;

  searchValue = '';

  columns: TableColumn[] = [
    {
      field: 'produit.nom',
      label: 'Produit',
      type: 'text',
    },

    {
      field: 'produitUnite.nom',
      label: 'Unité',
      type: 'text',
    },

    {
      field: 'quantite',
      label: 'Quantité',
      type: 'number',
    },

    {
      field: 'motif',
      label: 'Motif',
      type: 'text',
    },

    {
      field: 'createdAt',
      label: 'Date',
      type: 'date',
    },
  ];

  constructor(
    private readonly api: StockConsumptionApi,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.load();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['refresh']) {
      this.load();
    }
  }

  load() {
    this.api.findAll(this.page, this.limit, this.searchValue).subscribe(res => {
      this.data = res.data;

      this.total = res.total;

      this.totalPages = res.totalPages;

      this.cdr.detectChanges();
    });
  }

  search(value: string) {
    this.searchValue = value;

    this.page = 1;

    this.load();
  }

  changePage(page: number) {
    this.page = page;

    this.load();
  }
}
