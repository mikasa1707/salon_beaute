import { TestBed } from '@angular/core/testing';

import { StockConsumptionApiTs } from './stock-consumption-api.ts';

describe('StockConsumptionApiTs', () => {
  let service: StockConsumptionApiTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockConsumptionApiTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
