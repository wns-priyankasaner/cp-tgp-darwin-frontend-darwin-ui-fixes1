import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReallocateCaseComponent } from './reallocate-case.component';

describe('ReallocateCaseComponent', () => {
  let component: ReallocateCaseComponent;
  let fixture: ComponentFixture<ReallocateCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReallocateCaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReallocateCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
