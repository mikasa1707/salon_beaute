import { TestBed } from '@angular/core/testing';

import { ProduitUniteApi } from './produit-unite-api';

describe('ProduitUniteApi', () => {
  let service: ProduitUniteApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProduitUniteApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
