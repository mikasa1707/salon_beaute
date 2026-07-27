import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockConsumptionList } from './stock-consumption-list';

describe('StockConsumptionList', () => {
  let component: StockConsumptionList;
  let fixture: ComponentFixture<StockConsumptionList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockConsumptionList],
    }).compileComponents();

    fixture = TestBed.createComponent(StockConsumptionList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
