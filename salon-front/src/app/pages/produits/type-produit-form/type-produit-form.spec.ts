import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeProduitForm } from './type-produit-form';

describe('TypeProduitForm', () => {
  let component: TypeProduitForm;
  let fixture: ComponentFixture<TypeProduitForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeProduitForm],
    }).compileComponents();

    fixture = TestBed.createComponent(TypeProduitForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
