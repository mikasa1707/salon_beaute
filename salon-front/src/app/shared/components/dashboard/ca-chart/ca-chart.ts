import { Component, Input, OnChanges } from '@angular/core';

import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-ca-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './ca-chart.html',
})
export class CaChart implements OnChanges {
  @Input() data: any[] = [];

  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Chiffre d’affaires',
        fill: true,
      },
    ],
  };

  ngOnChanges(): void {
    this.lineChartData = {
      labels: this.data.map(x => x.date),

      datasets: [
        {
          data: this.data.map(x => x.total),
          label: 'Chiffre d’affaires',
          fill: true,
        },
      ],
    };
  }
}
