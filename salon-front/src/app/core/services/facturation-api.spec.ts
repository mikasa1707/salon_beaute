import { TestBed } from '@angular/core/testing';

import { FacturationApi } from './facturation-api';

describe('FacturationApi', () => {
  let service: FacturationApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacturationApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
