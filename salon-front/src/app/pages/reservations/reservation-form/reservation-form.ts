import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ReservationInformation } from '../components/reservation-information/reservation-information';
import { ReservationPrestations } from '../components/reservation-prestations/reservation-prestations';
import { ReservationSummary } from '../components/reservation-summary/reservation-summary';
import { ReservationNotes } from '../components/reservation-notes/reservation-notes';

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
  ],
  templateUrl: './reservation-form.html',
})
export class ReservationForm {

  form: FormGroup;
  selectedPrestations: any[] = [];

  constructor(
    private fb: FormBuilder
  ) {

    this.form = this.fb.group({
      origine: ['RENDEZ_VOUS'],
      clientId: [null],
      personnelId: [null],
      dateDebut: [null],
      statut: ['EN_ATTENTE'],
      notes: ['']
    });
  }

  get totalPrix() {
    return this.selectedPrestations.reduce((total, p) => total + Number(p.prix), 0);

  }

  get totalDuree() {
    return this.selectedPrestations.reduce((total, p) => total + Number(p.duree), 0);
  }

  save() {
    console.log({
      ...this.form.value,
      prestations: this.selectedPrestations,
      totalPrix: this.totalPrix,
      totalDuree: this.totalDuree
    });
  }

}