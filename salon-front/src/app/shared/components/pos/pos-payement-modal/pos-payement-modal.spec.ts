import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosPayementModal } from './pos-payement-modal';

describe('PosPayementModal', () => {
  let component: PosPayementModal;
  let fixture: ComponentFixture<PosPayementModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosPayementModal],
    }).compileComponents();

    fixture = TestBed.createComponent(PosPayementModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
