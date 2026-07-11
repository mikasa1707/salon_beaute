import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationInformation } from './reservation-information';

describe('ReservationInformation', () => {
  let component: ReservationInformation;
  let fixture: ComponentFixture<ReservationInformation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationInformation],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationInformation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
