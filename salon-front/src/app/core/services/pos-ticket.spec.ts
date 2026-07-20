import { TestBed } from '@angular/core/testing';

import { PosTicket } from './pos-ticket';

describe('PosTicket', () => {
  let service: PosTicket;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PosTicket);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
