import {
  Component,
  EventEmitter,
  Input,
  Output,
  AfterViewInit,
  ViewChild,
  ElementRef,
  HostListener
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
  templateUrl: './date-time-field.html',
  styleUrl: './date-time-field.scss'
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

  isClockOpen = false;

  ngAfterViewInit(): void {
    flatpickr(this.dateInput.nativeElement, {
      locale: French,
      altInput: true,
      altFormat: 'd/m/Y',
      dateFormat: 'Y-m-d',
      minDate: this.allowPast ? undefined : 'today',
      defaultDate: this.form.get(this.dateControl)?.value,
      onChange: dates => {
        if (dates.length) {
          const date = flatpickr.formatDate(
            dates[0],
            'Y-m-d'
          );
          this.form.patchValue({ [this.dateControl]: date });
          this.changed.emit();
        }
      }
    });

    if (this.timePickerMode === 'input') {
      flatpickr(this.timeInput.nativeElement, {
        enableTime: true,
        noCalendar: true,
        time_24hr: true,
        dateFormat: 'H:i',
        minuteIncrement: 15,

        onChange: dates => {
          if (dates.length) {
            const time = flatpickr.formatDate(dates[0], 'H:i');
            this.form.patchValue({ [this.timeControl]: time });
            this.changed.emit();
          }
        }
      });
    }
  }

  setTime(value: string): void {
    this.form.patchValue({
      [this.timeControl]: value
    });
    this.changed.emit();
    this.isClockOpen = false;
  }

  toggleClock() {
    this.isClockOpen = !this.isClockOpen;
  }

  clickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.time-picker-container')) {
      this.isClockOpen = false;
    }
  }
}