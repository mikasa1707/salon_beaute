import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashHistoryTable } from './cash-history-table';

describe('CashHistoryTable', () => {
  let component: CashHistoryTable;
  let fixture: ComponentFixture<CashHistoryTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashHistoryTable],
    }).compileComponents();

    fixture = TestBed.createComponent(CashHistoryTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
