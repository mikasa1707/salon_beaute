import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeClockPicker } from './time-clock-picker';

describe('TimeClockPicker', () => {
  let component: TimeClockPicker;
  let fixture: ComponentFixture<TimeClockPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeClockPicker],
    }).compileComponents();

    fixture = TestBed.createComponent(TimeClockPicker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
