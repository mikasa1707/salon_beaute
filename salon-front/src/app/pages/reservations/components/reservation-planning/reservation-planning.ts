import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ReservationCalendarComponent } from '../../components/reservation-calendar/reservation-calendar';
import { CommonModule } from '@angular/common';
import { ReservationApi } from '../../../../core/services/reservation-api';
import { ReservationDetailModal } from '../reservation-detail-modal/reservation-detail-modal';
import { ToastService } from '../../../../core/services/toast';
import { ReservationStatut } from '../../../../core/models/reservation-statut.enum';
import { ModalComponent } from '../../../../shared/components/modal/modal';
import { ReservationConsumptionComponent } from '../reservation-consumption/reservation-consumption';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservation-planning',
  standalone: true,
  imports: [CommonModule, ReservationCalendarComponent, ReservationDetailModal, ModalComponent, ReservationConsumptionComponent, PageHeaderComponent],
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

  showConsumptionModal = false;
  selectedConsumptionReservation: any = null;
  availableProducts: any[] = [];
  selectedProducts: any[] = [];

  constructor(
    private reservationService: ReservationApi,
    private cdr: ChangeDetectorRef,
    private toast: ToastService,
    private readonly router: Router
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
    if (statut === 'TERMINEE') {
      this.selectedConsumptionReservation = this.selectedReservation;
      this.showConsumptionModal = true;
      return;
    }
    this.changeReservationStatus(id, statut);
  }

  changeReservationStatus(id: number, statut: ReservationStatut, products: any[] = []) {
    this.reservationService.changeStatus(id, statut, products).subscribe({
      next: response => {
        this.toast.success('Statut de la réservation mis à jour');

        this.selectedReservation = response.reservation ?? response;

        this.updateAvailableActions();
        this.loadReservations();

        if (statut === ReservationStatut.TERMINEE && response.facturation) {
          this.router.navigate(['/caisse'], {
            state: {
              facturationId: response.facturation.id,
            },
          });
        }
      },
      error: err => {
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

  openConsumptionModal() {
    this.availableProducts = this.selectedReservation.prestations.flatMap((p: any) => p.prestation.produitsUtilises);
    this.selectedProducts = [];
    this.showConsumptionModal = true;
  }

  addProduct(product: any) {
    const exist = this.selectedProducts.find(p => p.prestationProduitId === product.id);
    if (exist) {
      exist.quantite++;
    } else {
      this.selectedProducts.push({
        prestationProduitId: product.id,
        quantite: 1,
        produit: product,
      });
    }
  }

  removeProduct(product: any) {
    this.selectedProducts = this.selectedProducts.filter(p => p.prestationProduitId !== product.prestationProduitId);
  }

  confirmConsumption(event: any[]) {
    this.changeReservationStatus(this.selectedReservation.id, ReservationStatut.TERMINEE, event);
    this.showConsumptionModal = false;
  }

  goto() {
    this.router.navigateByUrl('/reservations/new');
  }
}
