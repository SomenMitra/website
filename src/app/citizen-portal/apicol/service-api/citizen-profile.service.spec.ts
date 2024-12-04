import { TestBed } from '@angular/core/testing';

import { CitizenProfileService } from './citizen-profile.service';

describe('CitizenProfileService', () => {
  let service: CitizenProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CitizenProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
