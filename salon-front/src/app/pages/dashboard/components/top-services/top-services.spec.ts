import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopServices } from './top-services';

describe('TopServices', () => {
  let component: TopServices;
  let fixture: ComponentFixture<TopServices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopServices],
    }).compileComponents();

    fixture = TestBed.createComponent(TopServices);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
