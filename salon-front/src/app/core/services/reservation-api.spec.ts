import { TestBed } from '@angular/core/testing';

import { ReservationApi } from './reservation-api';

describe('ReservationApi', () => {
  let service: ReservationApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservationApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
