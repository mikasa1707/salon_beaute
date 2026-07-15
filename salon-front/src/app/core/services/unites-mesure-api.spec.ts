import { TestBed } from '@angular/core/testing';

import { UnitesMesureApi } from './unites-mesure-api';

describe('UnitesMesureApi', () => {
  let service: UnitesMesureApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitesMesureApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
