import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitUnitesForm } from './produit-unites-form';

describe('ProduitUnitesForm', () => {
  let component: ProduitUnitesForm;
  let fixture: ComponentFixture<ProduitUnitesForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduitUnitesForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ProduitUnitesForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
