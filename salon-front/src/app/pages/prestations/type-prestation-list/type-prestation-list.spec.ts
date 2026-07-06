import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypePrestationList } from './type-prestation-list';

describe('TypePrestationList', () => {
  let component: TypePrestationList;
  let fixture: ComponentFixture<TypePrestationList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypePrestationList],
    }).compileComponents();

    fixture = TestBed.createComponent(TypePrestationList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
