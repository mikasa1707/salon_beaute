import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumericKeyboard } from './numeric-keyboard';

describe('NumericKeyboard', () => {
  let component: NumericKeyboard;
  let fixture: ComponentFixture<NumericKeyboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumericKeyboard],
    }).compileComponents();

    fixture = TestBed.createComponent(NumericKeyboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
