import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoursBarGraphComponent } from './hours-bar-graph.component';

describe('HoursBarGraphComponent', () => {
  let component: HoursBarGraphComponent;
  let fixture: ComponentFixture<HoursBarGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoursBarGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoursBarGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
