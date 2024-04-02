import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutstandingBarGraphComponent } from './outstanding-bar-graph.component';

describe('OutstandingBarGraphComponent', () => {
  let component: OutstandingBarGraphComponent;
  let fixture: ComponentFixture<OutstandingBarGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutstandingBarGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutstandingBarGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
