import { TestBed } from '@angular/core/testing';

import { PrestationRecetteApi } from './prestation-recette-api';

describe('PrestationRecetteApi', () => {
  let service: PrestationRecetteApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrestationRecetteApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
