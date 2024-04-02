import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedVsCompletedComponent } from './received-vs-completed.component';

describe('ReceivedVsCompletedComponent', () => {
  let component: ReceivedVsCompletedComponent;
  let fixture: ComponentFixture<ReceivedVsCompletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivedVsCompletedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceivedVsCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
