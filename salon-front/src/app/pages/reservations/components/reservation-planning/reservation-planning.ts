import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ReservationCalendarComponent } from '../../components/reservation-calendar/reservation-calendar';
import { CommonModule } from '@angular/common';
import { ReservationApi } from '../../../../core/services/reservation-api';
import { ReservationDetailModal } from '../reservation-detail-modal/reservation-detail-modal';
import { ToastService } from '../../../../core/services/toast';
import { ReservationStatut } from '../../../../core/models/reservation-statut.enum';

@Component({
  selector: 'app-reservation-planning',
  standalone: true,
  imports: [CommonModule, ReservationCalendarComponent, ReservationDetailModal],
  templateUrl: './reservation-planning.html',
  styleUrl: './reservation-planning.scss',
})
export class ReservationPlanning implements OnInit {
  events: any[] = [];
  selectedReservation: any = null;
  availableStatuses: ReservationStatut[] = [];
  readonly allowedTransitions: Record<ReservationStatut, ReservationStatut[]> = {
    EN_ATTENTE: [ReservationStatut.CONFIRMEE, ReservationStatut.ANNULEE, ReservationStatut.ARRIVEE],
    CONFIRMEE: [ReservationStatut.EN_COURS, ReservationStatut.ANNULEE, ReservationStatut.ABSENT],
    ARRIVEE: [ReservationStatut.EN_COURS, ReservationStatut.ANNULEE, ReservationStatut.TERMINEE],
    EN_COURS: [ReservationStatut.TERMINEE, ReservationStatut.ANNULEE],
    TERMINEE: [],
    ANNULEE: [],
    ABSENT: [],
  };

  constructor(
    private reservationService: ReservationApi,
    private cdr: ChangeDetectorRef,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations() {
    this.reservationService.findAll().subscribe(reservations => {
      this.events = this.mapReservations(reservations);
      this.cdr.detectChanges();
    });
  }

  mapReservations(reservations: any[]) {
    return reservations.map(r => {
      const start = new Date(r.date_debut);
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + (r.total_duree || 30));
      const prestations = r.prestations?.map((p: any) => p.prestation.nom).join(', ');
      return {
        id: r.id.toString(),
        title: `${r.client?.prenom ?? ''} ${r.client?.nom ?? ''}`,
        start,
        end,
        backgroundColor: this.getStatusColor(r.statut),
        borderColor: this.getStatusColor(r.statut),
        extendedProps: {
          reservation: r,
          personnels: r.personnels ?? [],
          prestations,
        },
      };
    });
  }

  getStatusColor(status: string) {
    switch (status) {
      case 'EN_ATTENTE':
        return 'var(--bs-info)';
      case 'CONFIRMEE':
        return 'var(--bs-primary)';
      case 'EN_COURS':
        return 'var(--bs-warning)';
      case 'TERMINEE':
        return 'var(--bs-success)';
      case 'ANNULEE':
        return 'var(--bs-danger)';
      default:
        return 'var(--bs-secondary)';
    }
  }

  getPersonnelColor(color?: string): string {
    return color || 'var(--bs-primary)';
  }

  openReservationDetail(reservation: any) {
    this.selectedReservation = reservation;
    this.updateAvailableActions();
  }

  updateStatus(event: any) {
    const { id, statut } = event;

    this.reservationService.changeStatus(id, statut).subscribe({
      next: reservation => {
        this.toast.success('Statut de la réservation mis à jour');
        // Mettre à jour la réservation affichée dans le modal
        this.selectedReservation = reservation;
        // Recalcul des boutons disponibles
        this.updateAvailableActions();
        // Mettre à jour le calendrier sans fermer le modal
        this.loadReservations();
      },
      error: err => {
        console.error('Erreur changement statut', err);
        this.toast.error(err.error?.message ?? 'Erreur lors du changement de statut');
      },
    });
  }

  updateAvailableActions() {
    if (!this.selectedReservation) {
      this.availableStatuses = [];
      return;
    }
    this.availableStatuses = this.allowedTransitions[this.selectedReservation.statut as ReservationStatut] ?? [];
  }
}
