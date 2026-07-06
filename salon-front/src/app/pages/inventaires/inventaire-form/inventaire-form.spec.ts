import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventaireForm } from './inventaire-form';

describe('InventaireForm', () => {
  let component: InventaireForm;
  let fixture: ComponentFixture<InventaireForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventaireForm],
    }).compileComponents();

    fixture = TestBed.createComponent(InventaireForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
