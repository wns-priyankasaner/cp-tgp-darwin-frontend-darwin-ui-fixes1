import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentViewEmailDialogComponent } from './sent-view-email-dialog.component';

describe('SentViewEmailDialogComponent', () => {
  let component: SentViewEmailDialogComponent;
  let fixture: ComponentFixture<SentViewEmailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SentViewEmailDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SentViewEmailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
