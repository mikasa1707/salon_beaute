import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-caisse-card',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './caisse-card.html',
})
export class CaisseCard {
  @Input()
  data: any;
}
