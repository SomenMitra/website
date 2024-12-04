import { TestBed } from '@angular/core/testing';

import { FontResizeService } from './font-resize.service';

describe('FontResizeService', () => {
  let service: FontResizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FontResizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
