import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReservationDashboard } from '../../../../core/models/reservation-dashboard';

@Component({
  selector: 'app-reservation-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservation-table.html',
  styleUrl: './reservation-table.scss',
})
export class ReservationTable {
  @Input() title = '';
  @Input() reservations: ReservationDashboard[] = [];
}
