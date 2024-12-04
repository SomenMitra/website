import { TestBed } from '@angular/core/testing';

import { ApicolService } from './apicol.service';

describe('ApicolService', () => {
  let service: ApicolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApicolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
