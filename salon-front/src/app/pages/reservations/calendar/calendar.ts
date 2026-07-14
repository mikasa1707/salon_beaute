import { Component } from '@angular/core';
import { ReservationPlanning } from "../components/reservation-planning/reservation-planning";

@Component({
  selector: 'app-calendar',
  imports: [ReservationPlanning],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
})
export class Calendar {}
