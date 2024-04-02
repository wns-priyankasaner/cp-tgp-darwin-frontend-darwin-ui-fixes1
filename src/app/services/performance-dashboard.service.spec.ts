import { TestBed } from '@angular/core/testing';

import { PerformanceDashboardService } from './performance-dashboard.service';

describe('PerformanceDashboardService', () => {
  let service: PerformanceDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerformanceDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
