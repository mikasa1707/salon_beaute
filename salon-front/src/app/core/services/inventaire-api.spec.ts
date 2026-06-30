import { TestBed } from '@angular/core/testing';

import { InventaireApi } from './inventaire-api';

describe('InventaireApi', () => {
  let service: InventaireApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventaireApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
