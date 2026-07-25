import { TestBed } from '@angular/core/testing';

import { CashRegisterApi } from './cash-register-api';

describe('CashRegisterApi', () => {
  let service: CashRegisterApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CashRegisterApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
