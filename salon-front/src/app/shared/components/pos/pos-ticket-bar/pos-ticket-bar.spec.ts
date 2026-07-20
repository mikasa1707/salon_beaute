import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosTicketBar } from './pos-ticket-bar';

describe('PosTicketBar', () => {
  let component: PosTicketBar;
  let fixture: ComponentFixture<PosTicketBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosTicketBar],
    }).compileComponents();

    fixture = TestBed.createComponent(PosTicketBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
