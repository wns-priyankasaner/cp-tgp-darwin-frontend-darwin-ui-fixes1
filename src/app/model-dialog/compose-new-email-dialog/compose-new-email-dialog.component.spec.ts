import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComposeNewEmailDialogComponent } from './compose-new-email-dialog.component';

describe('ComposeNewEmailDialogComponent', () => {
  let component: ComposeNewEmailDialogComponent;
  let fixture: ComponentFixture<ComposeNewEmailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComposeNewEmailDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComposeNewEmailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
