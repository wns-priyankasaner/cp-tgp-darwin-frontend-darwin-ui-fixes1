import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillManagementComponent } from './skill-management.component';

describe('SkillManagementComponent', () => {
  let component: SkillManagementComponent;
  let fixture: ComponentFixture<SkillManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
