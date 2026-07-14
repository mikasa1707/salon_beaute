import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfertProduit } from './transfert-produit';

describe('TransfertProduit', () => {
  let component: TransfertProduit;
  let fixture: ComponentFixture<TransfertProduit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransfertProduit],
    }).compileComponents();

    fixture = TestBed.createComponent(TransfertProduit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
