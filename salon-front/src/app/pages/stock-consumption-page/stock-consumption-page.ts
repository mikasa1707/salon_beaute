import { Component } from '@angular/core';
import { ModalComponent } from '../../shared/components/modal/modal';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';
import { StockConsumptionForm } from './stock-consumption-form/stock-consumption-form';
import { StockConsumptionList } from './stock-consumption-list/stock-consumption-list';

@Component({
  selector: 'app-stock-consumption-page',
  standalone: true,
  imports: [PageHeaderComponent, ModalComponent, StockConsumptionList, StockConsumptionForm],
  templateUrl: './stock-consumption-page.html',
})
export class StockConsumptionPage {
  showForm = false;

  refresh = 0;

  openForm() {
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }

  saved() {
    this.closeForm();

    this.refresh++;
  }
}
