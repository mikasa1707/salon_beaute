import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosSummary } from './pos-summary';

describe('PosSummary', () => {
  let component: PosSummary;
  let fixture: ComponentFixture<PosSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosSummary],
    }).compileComponents();

    fixture = TestBed.createComponent(PosSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
