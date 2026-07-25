import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CashRegister } from '../../../../core/models/cash-register';
import { KpiCard } from "../../dashboard/kpi-card/kpi-card";

@Component({
  selector: 'app-cash-summary',
  standalone: true,
  imports: [CommonModule, KpiCard],
  templateUrl: './cash-summary.html',
})
export class CashSummary {
  @Input()
  cash!: CashRegister;
}
