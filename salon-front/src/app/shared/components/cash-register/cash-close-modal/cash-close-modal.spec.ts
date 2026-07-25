import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashCloseModal } from './cash-close-modal';

describe('CashCloseModal', () => {
  let component: CashCloseModal;
  let fixture: ComponentFixture<CashCloseModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashCloseModal],
    }).compileComponents();

    fixture = TestBed.createComponent(CashCloseModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
