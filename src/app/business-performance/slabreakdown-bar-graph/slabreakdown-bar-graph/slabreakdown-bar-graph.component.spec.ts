import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlabreakdownBarGraphComponent } from './slabreakdown-bar-graph.component';

describe('SlabreakdownBarGraphComponent', () => {
  let component: SlabreakdownBarGraphComponent;
  let fixture: ComponentFixture<SlabreakdownBarGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlabreakdownBarGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlabreakdownBarGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
