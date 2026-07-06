import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenteList } from './vente-list';

describe('VenteList', () => {
  let component: VenteList;
  let fixture: ComponentFixture<VenteList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VenteList],
    }).compileComponents();

    fixture = TestBed.createComponent(VenteList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
