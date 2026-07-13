import {
  Component,
  EventEmitter,
  Input,
  Output,
  AfterViewInit,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';

import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import flatpickr from 'flatpickr';
import { French } from 'flatpickr/dist/l10n/fr.js';

import { TimeClockPicker } from '../time-clock-picker/time-clock-picker';

@Component({
  selector: 'app-date-time-field',
  standalone: true,
  imports: [ReactiveFormsModule, TimeClockPicker],
  templateUrl: './date-time-field.html',
  styleUrl: './date-time-field.scss',
})
export class DateTimeField implements AfterViewInit {
  @Input() form!: FormGroup;
  @Input() dateControl = 'dateDebut';
  @Input() timeControl = 'heureDebut';
  @Input() dateLabel = 'Date';
  @Input() timeLabel = 'Heure';
  @Input() timePickerMode: 'input' | 'clock' = 'input';
  @Input() allowPast = false;
  @Input() disabled = false;

  @Output() changed = new EventEmitter<void>();

  @ViewChild('dateInput') dateInput!: ElementRef;
  @ViewChild('timeInput') timeInput!: ElementRef;

  isClockOpen = false;

  private datePickerInstance: any;
  private timePickerInstance: any;

  ngAfterViewInit(): void {
    this.datePickerInstance = flatpickr(this.dateInput.nativeElement, {
      locale: French,
      altInput: true,
      altFormat: 'd/m/Y',
      dateFormat: 'Y-m-d',
      minDate: this.allowPast ? undefined : 'today',
      defaultDate: this.form.get(this.dateControl)?.value,
      disable: [() => this.disabled],
      onChange: dates => {
        if (dates.length && !this.disabled) {
          const date = flatpickr.formatDate(dates[0], 'Y-m-d');

          this.form.patchValue({
            [this.dateControl]: date,
          });
        }
      },
    });

    if (this.timePickerMode === 'input') {
      this.timePickerInstance = flatpickr(this.timeInput.nativeElement, {
        enableTime: true,
        noCalendar: true,
        time_24hr: true,
        dateFormat: 'H:i',
        minuteIncrement: 15,
        onChange: dates => {
          if (dates.length && !this.disabled) {
            const time = flatpickr.formatDate(dates[0], 'H:i');

            this.form.patchValue({
              [this.timeControl]: time,
            });
          }
        },
      });
    }

    // Synchronisation formulaire -> picker

    this.form.get(this.dateControl)?.valueChanges.subscribe(value => {
      if (this.datePickerInstance && value) {
        this.datePickerInstance.setDate(value, false);
      }
    });

    this.form.get(this.timeControl)?.valueChanges.subscribe(value => {
      if (this.timePickerInstance && value) {
        const [hours, minutes] = value.split(':');
        const date = new Date();
        date.setHours(Number(hours), Number(minutes), 0);
        this.timePickerInstance.setDate(date, false);
      }
    });
  }

  setTime(value: string): void {
    this.form.patchValue({
      [this.timeControl]: value,
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
