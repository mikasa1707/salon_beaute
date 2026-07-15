import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestationRecetteModal } from './prestation-recette-modal';

describe('PrestationRecetteModal', () => {
  let component: PrestationRecetteModal;
  let fixture: ComponentFixture<PrestationRecetteModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrestationRecetteModal],
    }).compileComponents();

    fixture = TestBed.createComponent(PrestationRecetteModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
