import { TestBed } from '@angular/core/testing';

import { CitizenSchemeActivityService } from './citizen-scheme-activity.service';

describe('CitizenSchemeActivityService', () => {
  let service: CitizenSchemeActivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CitizenSchemeActivityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
