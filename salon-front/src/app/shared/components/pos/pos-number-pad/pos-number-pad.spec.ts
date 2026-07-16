import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosNumberPad } from './pos-number-pad';

describe('PosNumberPad', () => {
  let component: PosNumberPad;
  let fixture: ComponentFixture<PosNumberPad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosNumberPad],
    }).compileComponents();

    fixture = TestBed.createComponent(PosNumberPad);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
