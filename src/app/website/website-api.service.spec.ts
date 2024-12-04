import { TestBed } from '@angular/core/testing';

import { WebsiteApiService } from './website-api.service';

describe('WebsiteApiService', () => {
  let service: WebsiteApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsiteApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
