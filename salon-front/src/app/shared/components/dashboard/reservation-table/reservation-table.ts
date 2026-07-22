import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardReservation } from '../../../../core/models/dashboard';

@Component({
  selector: 'app-reservation-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservation-table.html',
  styleUrl: './reservation-table.scss',
})
export class ReservationTableComponent {
  @Input()
  title = 'Réservations';

  @Input()
  reservations: DashboardReservation[] = [];

  getPrestations(prestations: string[]): string {
    return prestations.join(', ');
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'EN_COURS':
        return 'bg-success';

      case 'CONFIRME':
        return 'bg-primary';

      case 'ATTENTE':
        return 'bg-warning text-dark';

      case 'TERMINE':
        return 'bg-secondary';

      case 'ANNULE':
        return 'bg-danger';

      default:
        return 'bg-light text-dark';
    }
  }
}
