import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationNotes } from './reservation-notes';

describe('ReservationNotes', () => {
  let component: ReservationNotes;
  let fixture: ComponentFixture<ReservationNotes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationNotes],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationNotes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
