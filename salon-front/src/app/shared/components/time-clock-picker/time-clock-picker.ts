import {
  Component,
  EventEmitter,
  Output,
  Input
} from '@angular/core';

@Component({
  selector: 'app-time-clock-picker',
  standalone: true,
  templateUrl: './time-clock-picker.html',
  styleUrl: './time-clock-picker.scss'
})
export class TimeClockPicker {

  @Input() value = '08:00';

  @Output() valueChange = new EventEmitter<string>();

  mode: 'hour' | 'minute' = 'hour';
  hour = 8;
  minute = 0;
  hours = Array.from({ length: 12 }, (_, i) => i + 1);
  minutes = [0, 15, 30, 45];

  selectHour(hour: number) {
    this.hour = hour;
    this.mode = 'minute';
  }

  selectMinute(minute: number) {
    this.minute = minute;
    const value =
      `${this.hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')
      }`;
    this.valueChange.emit(value);
  }
}