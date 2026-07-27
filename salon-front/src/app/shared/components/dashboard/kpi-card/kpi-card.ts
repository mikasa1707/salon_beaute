import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kpi-card',

  standalone: true,

  imports: [CommonModule],

  templateUrl: './kpi-card.html',
})
export class KpiCard {
  @Input() title = '';
  @Input() value: any;
  @Input() icon = '';
  @Input() color = 'primary';
  @Input() size: 1 | 2 | 3 | 4 | 5 | 6 = 4;
}
