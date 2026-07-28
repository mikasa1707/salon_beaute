import { TestBed } from '@angular/core/testing';

import { HtmlRenderer } from './html-renderer';

describe('HtmlRenderer', () => {
  let service: HtmlRenderer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HtmlRenderer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
