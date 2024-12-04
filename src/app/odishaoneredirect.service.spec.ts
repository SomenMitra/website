import { TestBed } from '@angular/core/testing';

import { OdishaoneRedirectService } from './odishaoneredirect.service';

describe('OdishaoneRedirectService', () => {
  let service: OdishaoneRedirectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OdishaoneRedirectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
