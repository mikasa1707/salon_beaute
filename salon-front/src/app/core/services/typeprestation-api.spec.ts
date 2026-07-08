import { TestBed } from '@angular/core/testing';

import { TypeprestationApi } from './typeprestation-api';

describe('TypeprestationApi', () => {
  let service: TypeprestationApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeprestationApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
