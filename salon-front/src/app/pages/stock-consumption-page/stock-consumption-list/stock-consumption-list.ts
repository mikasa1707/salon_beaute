import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from '../../../shared/components/data-table/data-table';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar';
import { TableColumn } from '../../../core/models/table-column';
import { StockConsumption } from '../../../core/models/stock-consumption';
import { StockConsumptionApi } from '../../../core/services/stock-consumption-api.ts';

@Component({
  selector: 'app-stock-consumption-list',
  standalone: true,
  imports: [CommonModule, DataTableComponent, PaginationComponent, SearchBarComponent],
  templateUrl: './stock-consumption-list.html',
})
export class StockConsumptionList implements OnInit, OnChanges {
  @Input() refresh = 0;

  @Output() selected = new EventEmitter<StockConsumption>();
  @Output() editConsumption = new EventEmitter<StockConsumption>();

  data: any[] = [];
  page = 1;
  limit = 10;
  total = 0;
  totalPages = 0;
  loading = false;
  searchValue = '';

  columns: TableColumn[] = [
    // {
    //   field: 'numero',
    //   label: 'N°',
    //   type: 'text',
    // },
    // {
    //   field: 'motif',
    //   label: 'Motif',
    //   type: 'text',
    // },
    // {
    //   field: 'createdAt',
    //   label: 'Date',
    //   type: 'datehour',
    // },
    {
      field: 'numero',
      label: 'N°',
      type: 'text',
      
    },
    {
      field: 'motif',
      label: 'Motif',
      type: 'text',
    },
    {
      field: 'createdAt',
      label: 'Date',
      type: 'datehour',
    },
  ];

  constructor(
    private readonly api: StockConsumptionApi,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['refresh'] && !changes['refresh'].firstChange) {
      this.load();
    }
  }

  load() {
    this.loading = true;

    this.api
      .findAll(this.page, this.limit, this.searchValue)

      .subscribe({
        next: res => {
          this.data = res.data;
          // this.data = res.data.map((item: StockConsumption) => ({
          //   ...item,

          //   produitLabel: item.items
          //     ?.map(x => x.produitUnite?.produit?.nom)
          //     .filter(Boolean)
          //     .join(', '),

          //   quantiteTotal: item.items?.reduce((sum, x) => sum + Number(x.quantite), 0),
          // }));

          this.total = res.total;

          this.totalPages = res.totalPages;

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: () => {
          this.loading = false;
        },
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

  view(item: any) {
    this.selected.emit(item as StockConsumption);
  }

  edit(item: StockConsumption) {
    this.editConsumption.emit(item);
  }

  archive(item: StockConsumption) {
    if (!confirm('Archiver cette consommation ?')) {
      return;
    }

    this.api
      .archive(item.id)

      .subscribe(() => {
        this.load();
      });
  }
}
