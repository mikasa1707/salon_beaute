import { TestBed } from '@angular/core/testing';

import { ProduitApi } from './produit-api';

describe('ProduitApi', () => {
  let service: ProduitApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProduitApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
