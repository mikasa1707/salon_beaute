import {
  Component,
  Input
} from '@angular/core';

import {
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';

@Component({
  selector: 'app-reservation-information',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './reservation-information.html'
})
export class ReservationInformation {

  @Input()
  form!: FormGroup;

}