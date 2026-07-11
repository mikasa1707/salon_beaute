import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reservation-notes',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './reservation-notes.html',
  styleUrl: './reservation-notes.scss',
})
export class ReservationNotes {

  @Input() form!: FormGroup;
}
