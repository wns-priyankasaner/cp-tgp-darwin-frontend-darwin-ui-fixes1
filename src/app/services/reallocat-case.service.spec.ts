import { TestBed } from '@angular/core/testing';

import { ReallocatCaseService } from './reallocat-case.service';

describe('ReallocatCaseService', () => {
  let service: ReallocatCaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReallocatCaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
