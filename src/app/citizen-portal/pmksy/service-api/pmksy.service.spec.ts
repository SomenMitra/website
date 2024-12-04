import { TestBed } from '@angular/core/testing';

import { PmksyService } from './pmksy.service';

describe('PmksyService', () => {
  let service: PmksyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PmksyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
