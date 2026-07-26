import { TestBed } from '@angular/core/testing';

import { CahMovementApi } from './cah-movement-api';

describe('CahMovementApi', () => {
  let service: CahMovementApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CahMovementApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
