import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockConsumptionPage } from './stock-consumption-page';

describe('StockConsumptionPage', () => {
  let component: StockConsumptionPage;
  let fixture: ComponentFixture<StockConsumptionPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockConsumptionPage],
    }).compileComponents();

    fixture = TestBed.createComponent(StockConsumptionPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
