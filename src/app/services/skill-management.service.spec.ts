import { TestBed } from '@angular/core/testing';

import { SkillManagementService } from './skill-management.service';

describe('SkillManagementService', () => {
  let service: SkillManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkillManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
