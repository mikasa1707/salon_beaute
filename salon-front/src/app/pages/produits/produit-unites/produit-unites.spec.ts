import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitUnites } from './produit-unites';

describe('ProduitUnites', () => {
  let component: ProduitUnites;
  let fixture: ComponentFixture<ProduitUnites>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduitUnites],
    }).compileComponents();

    fixture = TestBed.createComponent(ProduitUnites);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
