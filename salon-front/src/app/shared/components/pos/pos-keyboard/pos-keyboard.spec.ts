import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosKeyboard } from './pos-keyboard';

describe('PosKeyboard', () => {
  let component: PosKeyboard;
  let fixture: ComponentFixture<PosKeyboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosKeyboard],
    }).compileComponents();

    fixture = TestBed.createComponent(PosKeyboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
