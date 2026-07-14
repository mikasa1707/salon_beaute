import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';

@Component({
  selector: 'app-reservation-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './reservation-calendar.html',
  styleUrl: './reservation-calendar.scss',
})
export class ReservationCalendarComponent implements OnChanges {
  @Input()
  events: any[] = [];
  currentTitle: string = '';

  @Output() reservationClick = new EventEmitter<any>();

  @ViewChild(FullCalendarComponent)
  calendarComponent!: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, bootstrap5Plugin],
    themeSystem: 'bootstrap5',
    initialView: 'timeGridWeek',
    locale: 'fr',
    height: 'auto',
    eventDisplay: 'block',
    dayMaxEventRows: true,
    expandRows: true,
    dayMaxEvents: true,
    allDaySlot: false,
    slotMinTime: '05:00:00',
    slotMaxTime: '19:00:00',
    nowIndicator: true,
    headerToolbar: false,

    eventContent: arg => {
      const reservation = arg.event.extendedProps['reservation'];
      const personnels = arg.event.extendedProps['personnels'] ?? [];
      const prestations = arg.event.extendedProps['prestations'] ?? '';
      const viewType = arg.view.type;
      const client = `
      ${reservation.client?.prenom ?? ''}
      ${reservation.client?.nom ?? ''}
    `;

      const personnelIcons = personnels
        .map(
          (p: any) => `
          <span
            class="fc-personnel-icon"
            title="${p.prenom} ${p.nom}"
            style="color:${p.couleurAgenda ?? '#6c757d'}"
          >
            <i class="fa-solid fa-user"></i>
          </span>
        `,
        )
        .join('');

      /**
       * Vue année
       */
      if (viewType === 'multiMonthYear' || viewType.includes('Year')) {
        return {
          html: `
            <div class="fc-year-event d-flex justify-content-between align-items-center">
              <span class="text-truncate">
                ${client}
              </span>
              <span class="text-nowrap">
                ${personnelIcons}
              </span>
            </div>
          `,
        };
      }

      /**
       * Vue mois
       */
      if (viewType === 'dayGridMonth') {
        return {
          html: `
          <div class="fc-month-event">
            <span class="text-truncate">
              ${client}
            </span>
            <span class="text-nowrap">
              ${personnelIcons}
            </span>
          </div>
        `,
        };
      }
      /**
       * Vue semaine
       */
      if (viewType === 'timeGridWeek') {
        return {
          html: `
          <div class="fc-week-event">
            <div class="d-flex justify-content-between">
              <span class="fw-bold text-truncate">
                ${client}
              </span>
              <span>
                ${personnelIcons}
              </span>
            </div>
          </div>
        `,
        };
      }

      /**
       * Vue jour
       */
      return {
        html: `
        <div class="d-flex justify-content-between">
          <div class="fw-bold">
            ${client}
          </div>
          <div>
            ${prestations}
          </div>
          <div class="">
            ${personnelIcons}
          </div>
        </div>
      `,
      };
    },
    eventClick: info => {
      const reservation = info.event.extendedProps['reservation'];
      this.reservationClick.emit(reservation);
    },
  };

  ngOnChanges(): void {
    this.calendarOptions = {
      ...this.calendarOptions,
      events: this.events,
    };
  }

  get calendarApi() {
    return this.calendarComponent.getApi();
  }

  previous() {
    this.calendarApi.prev();
    this.updateTitle();
  }

  next() {
    this.calendarApi.next();
    this.updateTitle();
  }

  today() {
    this.calendarApi.today();
    this.updateTitle();
  }

  changeView(view: string) {
    this.calendarApi.changeView(view);
    this.updateTitle();
  }

  ngAfterViewInit() {
    this.updateTitle();
  }

  updateTitle() {
    this.currentTitle = this.calendarApi.view.title;
  }
}
