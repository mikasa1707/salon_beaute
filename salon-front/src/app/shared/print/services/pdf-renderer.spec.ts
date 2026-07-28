import { TestBed } from '@angular/core/testing';

import { PdfRenderer } from './pdf-renderer';

describe('PdfRenderer', () => {
  let service: PdfRenderer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfRenderer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
