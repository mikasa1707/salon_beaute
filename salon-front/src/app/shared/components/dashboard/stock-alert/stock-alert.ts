import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stock-alert',

  standalone: true,

  templateUrl: './stock-alert.html',
})
export class StockAlert {
  @Input()
  items: any[] = [];
}
