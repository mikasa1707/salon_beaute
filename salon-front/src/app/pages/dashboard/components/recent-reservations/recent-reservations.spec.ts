import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentReservations } from './recent-reservations';

describe('RecentReservations', () => {
  let component: RecentReservations;
  let fixture: ComponentFixture<RecentReservations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentReservations],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentReservations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
