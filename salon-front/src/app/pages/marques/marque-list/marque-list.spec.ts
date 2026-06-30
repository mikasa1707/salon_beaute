import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarqueList } from './marque-list';

describe('MarqueList', () => {
  let component: MarqueList;
  let fixture: ComponentFixture<MarqueList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarqueList],
    }).compileComponents();

    fixture = TestBed.createComponent(MarqueList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
