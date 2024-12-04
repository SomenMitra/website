import { TestBed } from '@angular/core/testing';

import { CitizenSchemeService } from './citizen-scheme.service';

describe('CitizenSchemeService', () => {
  let service: CitizenSchemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CitizenSchemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
