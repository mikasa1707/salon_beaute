import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-stock-alert',
  standalone: true,
  templateUrl: './stock-alert.html',
})
export class StockAlert {
  @Input() items: any[] = [];

  @Output() viewAll = new EventEmitter<void>();

  readonly limit = 5;

  get displayedItems() {
    return this.items.slice(0, this.limit);
  }

  get remaining() {
    return Math.max(0, this.items.length - this.limit);
  }

  showAll() {
    this.viewAll.emit();
  }
}
