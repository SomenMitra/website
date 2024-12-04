import { TestBed } from '@angular/core/testing';

import { CitizenMasterService } from './citizen-master.service';

describe('CitizenMasterService', () => {
  let service: CitizenMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CitizenMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
