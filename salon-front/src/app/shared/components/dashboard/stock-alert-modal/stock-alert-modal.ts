import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ModalComponent } from '../../../components/modal/modal';
import { DataTableComponent } from '../../../components/data-table/data-table';

import { TableColumn } from '../../../../core/models/table-column';

@Component({
  selector: 'app-stock-alert-modal',
  standalone: true,
  imports: [ModalComponent, DataTableComponent],
  templateUrl: './stock-alert-modal.html',
})
export class StockAlertModal {
  @Input() show = false;
  @Input() items: any[] = [];

  @Output() closed = new EventEmitter<void>();
  @Output() openStock = new EventEmitter<any>();

  columns: TableColumn[] = [
    {
      field: 'produit',
      label: 'Produit',
    },
    {
      field: 'unite',
      label: 'Unité',
    },
    {
      field: 'stock',
      label: 'Stock',
      type: 'badge',
      badgeClass: value => (value <= 0 ? 'danger' : value <= 5 ? 'warning' : 'success'),
    },
    {
      field: 'minimum',
      label: 'Minimum',
    },
    {
      field: 'ecart',
      label: 'Écart',
      type: 'badge',
      badgeClass: value => (value < 0 ? 'danger' : 'success'),
    },
  ];

  close() {
    this.closed.emit();
  }

  go(item: any) {
    this.openStock.emit(item);
  }
}
