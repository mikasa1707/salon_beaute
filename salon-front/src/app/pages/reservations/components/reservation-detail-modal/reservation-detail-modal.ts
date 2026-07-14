import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReservationStatut } from '../../../../core/models/reservation-statut.enum';
import { ReservationStatusButton } from '../../../../core/config/reservation-status.config';

@Component({
  selector: 'app-reservation-detail-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservation-detail-modal.html',
  styleUrl: './reservation-detail-modal.scss',
})
export class ReservationDetailModal {
  @Input() reservation: any;
  @Output() close = new EventEmitter<void>();
  @Output() statusChange = new EventEmitter<any>();

  statusButtons = ReservationStatusButton;

  allowedTransitions: Record<ReservationStatut, ReservationStatut[]> = {
    EN_ATTENTE: [ReservationStatut.CONFIRMEE, ReservationStatut.ANNULEE, ReservationStatut.ARRIVEE],
    CONFIRMEE: [ReservationStatut.EN_COURS, ReservationStatut.ANNULEE, ReservationStatut.ABSENT],
    ARRIVEE: [ReservationStatut.EN_COURS, ReservationStatut.ANNULEE, ReservationStatut.TERMINEE],
    EN_COURS: [ReservationStatut.TERMINEE, ReservationStatut.ANNULEE],
    TERMINEE: [],
    ANNULEE: [],
    ABSENT: [],
  };
  statuts = [
    {
      value: 'EN_ATTENTE',
      label: 'En attente',
    },
    {
      value: 'CONFIRMEE',
      label: 'Confirmée',
    },
    {
      value: 'ARRIVEE',
      label: 'Arrivée',
    },
    {
      value: 'EN_COURS',
      label: 'En cours',
    },
    {
      value: 'TERMINEE',
      label: 'Terminée',
    },
    {
      value: 'ANNULEE',
      label: 'Annulée',
    },
    {
      value: 'ABSENT',
      label: 'Absent',
    },
  ];

  changeStatus(status: string) {
    this.statusChange.emit({
      id: this.reservation.id,
      statut: status,
    });
  }

  closeModal() {
    this.close.emit();
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'EN_COURS':
        return 'bg-warning';
      case 'TERMINEE':
        return 'bg-success';
      case 'ANNULEE':
        return 'bg-danger';
      case 'CONFIRMEE':
        return 'bg-primary';
      default:
        return 'bg-secondary';
    }
  }

  getAvailableActions(): ReservationStatut[] {
    if (!this.reservation) {
      return [];
    }
    return this.allowedTransitions[this.reservation.statut as ReservationStatut] ?? [];
  }
}
