import { TestBed } from '@angular/core/testing';

import { CitizenAuthGuardGuard } from './citizen-auth-guard.guard';

describe('CitizenAuthGuardGuard', () => {
  let guard: CitizenAuthGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CitizenAuthGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
