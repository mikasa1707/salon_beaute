import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockProductGrid } from './stock-product-grid';

describe('StockProductGrid', () => {
  let component: StockProductGrid;
  let fixture: ComponentFixture<StockProductGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockProductGrid],
    }).compileComponents();

    fixture = TestBed.createComponent(StockProductGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
