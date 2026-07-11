import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationPrestations } from './reservation-prestations';

describe('ReservationPrestations', () => {
  let component: ReservationPrestations;
  let fixture: ComponentFixture<ReservationPrestations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationPrestations],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationPrestations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
