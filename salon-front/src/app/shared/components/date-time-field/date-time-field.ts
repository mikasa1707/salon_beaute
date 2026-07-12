import {
  Component,
  EventEmitter,
  Input,
  Output,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';

import {
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';

import flatpickr from 'flatpickr';
import { French } from 'flatpickr/dist/l10n/fr.js';

import { TimeClockPicker } from '../time-clock-picker/time-clock-picker';

@Component({
  selector: 'app-date-time-field',
  standalone: true,
  imports: [ReactiveFormsModule, TimeClockPicker],
  templateUrl: './date-time-field.html'
})
export class DateTimeField implements AfterViewInit {

  @Input() form!: FormGroup;
  @Input() dateControl = 'dateDebut';
  @Input() timeControl = 'heureDebut';
  @Input() dateLabel = 'Date';
  @Input() timeLabel = 'Heure';
  @Input() timePickerMode: 'input' | 'clock' = 'input';
  @Input() allowPast = false;
  // @Input() timePickerMode:'input'|'clock'='input';

  @Output() changed = new EventEmitter<void>();

  @ViewChild('dateInput') dateInput!: ElementRef;
  @ViewChild('timeInput') timeInput!: ElementRef;

  ngAfterViewInit(): void {
    flatpickr(this.dateInput.nativeElement, {
      locale: French,
      dateFormat: 'Y-m-d',
      minDate: this.allowPast ? undefined : 'today',
      defaultDate: this.form.get(this.dateControl)?.value,
      onChange: dates => {
        if (dates.length) {
          const date = dates[0].toISOString().split('T')[0];
          this.form.patchValue({ [this.dateControl]: date });
          this.changed.emit();
        }
      }
    });

    flatpickr(this.timeInput.nativeElement, {
      enableTime: true,
      noCalendar: true,
      time_24hr: true,
      dateFormat: 'H:i',
      minuteIncrement: 15,
      defaultDate: this.form.get(this.timeControl)?.value,
      onChange: dates => {
        if (dates.length) {
          const time = dates[0].toTimeString().substring(0, 5);
          this.form.patchValue({ [this.timeControl]: time });
          this.changed.emit();
        }
      }
    });
  }

  setTime(value: string) {
    this.form.patchValue({ [this.timeControl]: value });
    this.changed.emit();
  }
}