import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashMovementForm } from './cash-movement-form';

describe('CashMovementForm', () => {
  let component: CashMovementForm;
  let fixture: ComponentFixture<CashMovementForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashMovementForm],
    }).compileComponents();

    fixture = TestBed.createComponent(CashMovementForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
