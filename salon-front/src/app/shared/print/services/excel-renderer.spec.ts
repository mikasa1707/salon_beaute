import { TestBed } from '@angular/core/testing';

import { ExcelRenderer } from './excel-renderer';

describe('ExcelRenderer', () => {
  let service: ExcelRenderer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcelRenderer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
