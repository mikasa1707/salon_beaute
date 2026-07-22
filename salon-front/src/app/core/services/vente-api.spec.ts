import { TestBed } from '@angular/core/testing';

import { VenteApi } from './vente-api';

describe('VenteApi', () => {
  let service: VenteApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VenteApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
