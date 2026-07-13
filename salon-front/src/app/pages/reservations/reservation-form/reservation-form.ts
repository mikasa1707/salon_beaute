import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ReservationInformation } from '../components/reservation-information/reservation-information';
import { ReservationPrestations } from '../components/reservation-prestations/reservation-prestations';
import { ReservationSummary } from '../components/reservation-summary/reservation-summary';
import { ReservationNotes } from '../components/reservation-notes/reservation-notes';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';

import { ReservationApi } from '../../../core/services/reservation-api';
import { ToastService } from '../../../core/services/toast';
import { Personnel } from '../../../core/models/personnel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ReservationInformation,
    ReservationPrestations,
    ReservationSummary,
    ReservationNotes,
    PageHeaderComponent,
  ],
  templateUrl: './reservation-form.html',
})
export class ReservationForm {
  form: FormGroup;

  selectedPrestations: any[] = [];
  selectedPersonnel: Personnel[] = [];

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationApi,
    private toast: ToastService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      origine: ['RENDEZ_VOUS'],
      clientId: [null, Validators.required],
      personnelId: [null, Validators.required],
      dateDebut: [null, Validators.required],
      heureDebut: [null, Validators.required],
      statut: ['EN_ATTENTE'],
      notes: [''],
    });
  }

  get totalPrix(): number {
    return this.selectedPrestations.reduce((total, p) => total + Number(p.prix), 0);
  }

  get totalDuree(): number {
    return this.selectedPrestations.reduce((total, p) => total + Number(p.duree), 0);
  }

  get canSave(): boolean {
    return (
      this.form.valid &&
      !!this.form.value.clientId &&
      this.selectedPersonnel.length > 0 &&
      this.selectedPrestations.length > 0
    );
  }

  save(): void {
    if (!this.canSave) {
      this.toast.warning('Veuillez compléter les informations de la réservation.');
      return;
    }
    const dto = {
      client_id: this.form.value.clientId,
      personnel_ids: this.selectedPersonnel.map(p => p.id),
      date_debut: new Date(`${this.form.value.dateDebut}T${this.form.value.heureDebut}:00`),
      prestations: this.selectedPrestations.map(p => ({ prestation_id: p.id, quantite: 1 })),
    };

    this.reservationService.create(dto).subscribe({
      next: () => {
        this.toast.success('Réservation créée avec succès');
        this.resetForm();
        this.router.navigate(['/reservations']);
      },
      error: err => {
        this.toast.error(err.error?.message || 'Erreur lors de la création');
      },
    });
  }

  onPersonnelChange(personnels: Personnel[]) {
    this.selectedPersonnel = personnels;
  }

  resetForm(): void {
    this.form.reset({
      origine: 'RENDEZ_VOUS',
      clientId: null,
      personnelId: null,
      dateDebut: null,
      heureDebut: null,
      statut: 'EN_ATTENTE',
      notes: '',
    });

    this.selectedPrestations = [];

    this.selectedPersonnel = [];
  }
}
