import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorForm } from './selector-form';

describe('SelectorForm', () => {
  let component: SelectorForm;
  let fixture: ComponentFixture<SelectorForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectorForm],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectorForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
