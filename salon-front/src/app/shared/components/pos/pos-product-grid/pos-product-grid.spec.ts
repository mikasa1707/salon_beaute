import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosProductGrid } from './pos-product-grid';

describe('PosProductGrid', () => {
  let component: PosProductGrid;
  let fixture: ComponentFixture<PosProductGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosProductGrid],
    }).compileComponents();

    fixture = TestBed.createComponent(PosProductGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
