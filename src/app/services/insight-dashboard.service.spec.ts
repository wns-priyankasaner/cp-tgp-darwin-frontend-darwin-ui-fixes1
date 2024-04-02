import { TestBed } from '@angular/core/testing';

import { InsightDashboardService } from './insight-dashboard.service';

describe('InsightDashboardService', () => {
  let service: InsightDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsightDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
