import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestationForm } from './prestation-form';

describe('PrestationForm', () => {
  let component: PrestationForm;
  let fixture: ComponentFixture<PrestationForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrestationForm],
    }).compileComponents();

    fixture = TestBed.createComponent(PrestationForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
