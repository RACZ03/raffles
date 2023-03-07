import { TestBed } from '@angular/core/testing';

import { SalesExtraService } from './sales-extra.service';

describe('SalesExtraService', () => {
  let service: SalesExtraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesExtraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
