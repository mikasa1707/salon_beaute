import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitConfig } from './produit-config';

describe('ProduitConfig', () => {
  let component: ProduitConfig;
  let fixture: ComponentFixture<ProduitConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduitConfig],
    }).compileComponents();

    fixture = TestBed.createComponent(ProduitConfig);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
