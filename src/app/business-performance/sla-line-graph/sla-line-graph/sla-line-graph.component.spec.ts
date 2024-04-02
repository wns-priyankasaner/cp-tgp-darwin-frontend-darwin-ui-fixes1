import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaLineGraphComponent } from './sla-line-graph.component';

describe('SlaLineGraphComponent', () => {
  let component: SlaLineGraphComponent;
  let fixture: ComponentFixture<SlaLineGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlaLineGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlaLineGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
