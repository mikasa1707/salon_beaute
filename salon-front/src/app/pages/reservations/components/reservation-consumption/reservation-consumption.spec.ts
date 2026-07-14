import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationConsumption } from './reservation-consumption';

describe('ReservationConsumption', () => {
  let component: ReservationConsumption;
  let fixture: ComponentFixture<ReservationConsumption>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationConsumption],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationConsumption);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
