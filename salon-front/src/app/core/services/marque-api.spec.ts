import { TestBed } from '@angular/core/testing';

import { MarqueApi } from './marque-api';

describe('MarqueApi', () => {
  let service: MarqueApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarqueApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
