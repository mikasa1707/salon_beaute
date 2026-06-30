import { TestBed } from '@angular/core/testing';

import { PrestationApi } from './prestation-api';

describe('PrestationApi', () => {
  let service: PrestationApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrestationApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
