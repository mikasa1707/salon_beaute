import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationCalendar } from './reservation-calendar';

describe('ReservationCalendar', () => {
  let component: ReservationCalendar;
  let fixture: ComponentFixture<ReservationCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationCalendar],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationCalendar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
