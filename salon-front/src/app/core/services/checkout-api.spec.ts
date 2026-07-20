import { TestBed } from '@angular/core/testing';

import { CheckoutApi } from './checkout-api';

describe('CheckoutApi', () => {
  let service: CheckoutApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckoutApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
