import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockConsumptionForm } from './stock-consumption-form';

describe('StockConsumptionForm', () => {
  let component: StockConsumptionForm;
  let fixture: ComponentFixture<StockConsumptionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockConsumptionForm],
    }).compileComponents();

    fixture = TestBed.createComponent(StockConsumptionForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
