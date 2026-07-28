import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockCart } from './stock-cart';

describe('StockCart', () => {
  let component: StockCart;
  let fixture: ComponentFixture<StockCart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockCart],
    }).compileComponents();

    fixture = TestBed.createComponent(StockCart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
