import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAlert } from './stock-alert';

describe('StockAlert', () => {
  let component: StockAlert;
  let fixture: ComponentFixture<StockAlert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockAlert],
    }).compileComponents();

    fixture = TestBed.createComponent(StockAlert);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
