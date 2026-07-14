import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationPlanning } from './reservation-planning';

describe('ReservationPlanning', () => {
  let component: ReservationPlanning;
  let fixture: ComponentFixture<ReservationPlanning>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationPlanning],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationPlanning);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
