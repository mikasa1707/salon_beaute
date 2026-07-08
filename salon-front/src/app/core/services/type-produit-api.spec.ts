import { TestBed } from '@angular/core/testing';

import { TypeProduitApi } from './type-produit-api';

describe('TypeProduitApi', () => {
  let service: TypeProduitApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeProduitApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
