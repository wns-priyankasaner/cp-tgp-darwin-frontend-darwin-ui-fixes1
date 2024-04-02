import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AhtLineGraphComponent } from './aht-line-graph.component';

describe('AhtLineGraphComponent', () => {
  let component: AhtLineGraphComponent;
  let fixture: ComponentFixture<AhtLineGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AhtLineGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AhtLineGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
