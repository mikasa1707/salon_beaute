import { Component, Input } from '@angular/core';
import { CashRegister } from '../../../../core/models/cash-register';

@Component({
  selector: 'app-cash-movement-list',
  imports: [],
  templateUrl: './cash-movement-list.html',
  styleUrl: './cash-movement-list.scss',
})
export class CashMovementList {
  @Input() cash?: CashRegister;
}
