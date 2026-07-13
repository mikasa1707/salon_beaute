import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnInit
} from '@angular/core';

@Component({
  selector: 'app-time-clock-picker',
  standalone: true,
  templateUrl: './time-clock-picker.html',
  styleUrl: './time-clock-picker.scss'
})
export class TimeClockPicker implements OnInit {

  @Input() value = '08:00';

  @Output() valueChange = new EventEmitter<string>();

  mode: 'hour' | 'minute' = 'hour';
  hour = 8;
  minute = 0;
  hours = Array.from({ length: 24 }, (_, i) => i + 1);
  minutes = Array.from({ length: 12 }, (_, j) => j * 5);

  ngOnInit(): void {
    console.log(this.value)
    if (this.value) {
      const [hour, minute] = this.value.split(':');
      this.hour = Number(hour);
      this.minute = Number(minute);
    }
  }

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

  getPosition(hour: number) {
    const isInner = hour > 12;
    const index = isInner ? hour - 12 : hour;
    const radius = isInner ? 75 : 115;
    const angle = (index * 30 - 90) * Math.PI / 180;

    return {
      left: 50 + Math.cos(angle) * radius / 2.8,
      top: 50 + Math.sin(angle) * radius / 2.8,
      inner: isInner
    };
  }

  getMinutePosition(minute: number) {
    const index = minute / 5;
    const angle = (index * 30 - 90) * Math.PI / 180;
    const radius = 110;

    return {
      x: 50 + Math.cos(angle) * radius / 2.8,
      y: 50 + Math.sin(angle) * radius / 2.8
    };
  }
}