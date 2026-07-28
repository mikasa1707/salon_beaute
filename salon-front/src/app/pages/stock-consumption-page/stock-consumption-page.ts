import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockConsumptionList } from './stock-consumption-list/stock-consumption-list';
import { StockConsumption } from '../../core/models/stock-consumption';
import { DataTableComponent } from '../../shared/components/data-table/data-table';
import { PaginationComponent } from '../../shared/components/pagination/pagination';
import { TableColumn } from '../../core/models/table-column';
import { StockConsumptionApi } from '../../core/services/stock-consumption-api.ts';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';
import { ModalComponent } from '../../shared/components/modal/modal';
import { StockConsumptionForm } from './stock-consumption-form/stock-consumption-form';

@Component({
  selector: 'app-stock-consumption-page',
  standalone: true,
  imports: [CommonModule, StockConsumptionList, DataTableComponent, PaginationComponent, PageHeaderComponent, ModalComponent, StockConsumptionForm],
  templateUrl: './stock-consumption-page.html',
})
export class StockConsumptionPage {
  showForm = false;
  refresh = 0;
  selected?: StockConsumption;
  editConsumption?: StockConsumption;
  detailData: any[] = [];
  detailPage = 1;
  detailLimit = 10;
  detailTotal = 0;
  detailTotalPages = 0;
  detailColumns: TableColumn[] = [
    {
      field: 'produitUnite.produit.nom',
      label: 'Produit',
      type: 'text',
    },
    {
      field: 'quantite',
      label: 'Quantité',
      type: 'number',
    },
  ];

  constructor(
    private readonly api: StockConsumptionApi,
    private readonly cdr: ChangeDetectorRef
  ) {}

  selectConsumption(consumption: StockConsumption) {
    this.selected = consumption;

    this.detailPage = 1;

    this.loadDetails();
  }

  loadDetails() {
    if (!this.selected) {
      this.detailData = [];
      this.detailTotal = 0;
      this.detailTotalPages = 0;

      return;
    }

    const items = this.selected.items ?? [];
    this.detailTotal = items.length;
    this.detailTotalPages = Math.ceil(this.detailTotal / this.detailLimit);
    const start = (this.detailPage - 1) * this.detailLimit;
    this.detailData = items.slice(start, start + this.detailLimit);
    this.cdr.detectChanges();
  }

  changeDetailPage(page: number) {
    this.detailPage = page;

    this.loadDetails();
  }

  refreshList() {
    this.refresh++;
  }

  openForm() {
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.loadDetails();
    this.editConsumption = undefined;
  }

  edit(item: StockConsumption) {
    this.editConsumption = item;
    this.showForm = true;
  }

  saved() {
    this.closeForm();
    this.loadDetails();
    this.refresh++;
  }
}
