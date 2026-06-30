import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestationList } from './prestation-list';

describe('PrestationList', () => {
  let component: PrestationList;
  let fixture: ComponentFixture<PrestationList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrestationList],
    }).compileComponents();

    fixture = TestBed.createComponent(PrestationList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
