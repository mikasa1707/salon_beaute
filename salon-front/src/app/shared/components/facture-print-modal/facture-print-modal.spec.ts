import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturePrintModal } from './facture-print-modal';

describe('FacturePrintModal', () => {
  let component: FacturePrintModal;
  let fixture: ComponentFixture<FacturePrintModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturePrintModal],
    }).compileComponents();

    fixture = TestBed.createComponent(FacturePrintModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
