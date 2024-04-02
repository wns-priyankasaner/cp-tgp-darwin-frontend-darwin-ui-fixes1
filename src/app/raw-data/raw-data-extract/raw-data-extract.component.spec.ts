import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawDataExtractComponent } from './raw-data-extract.component';

describe('RawDataExtractComponent', () => {
  let component: RawDataExtractComponent;
  let fixture: ComponentFixture<RawDataExtractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RawDataExtractComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RawDataExtractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
