import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailbodyDialogSentviewComponent } from './emailbody-dialog-sentview.component';

describe('EmailbodyDialogSentviewComponent', () => {
  let component: EmailbodyDialogSentviewComponent;
  let fixture: ComponentFixture<EmailbodyDialogSentviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailbodyDialogSentviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailbodyDialogSentviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
