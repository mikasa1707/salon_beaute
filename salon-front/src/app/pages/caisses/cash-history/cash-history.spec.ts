import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashHistory } from './cash-history';

describe('CashHistory', () => {
  let component: CashHistory;
  let fixture: ComponentFixture<CashHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashHistory],
    }).compileComponents();

    fixture = TestBed.createComponent(CashHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
