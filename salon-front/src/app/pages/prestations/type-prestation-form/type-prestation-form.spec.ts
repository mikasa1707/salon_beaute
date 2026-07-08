import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypePrestationForm } from './type-prestation-form';

describe('TypePrestationForm', () => {
  let component: TypePrestationForm;
  let fixture: ComponentFixture<TypePrestationForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypePrestationForm],
    }).compileComponents();

    fixture = TestBed.createComponent(TypePrestationForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
