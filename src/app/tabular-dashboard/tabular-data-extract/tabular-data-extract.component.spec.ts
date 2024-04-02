import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabularDataExtractComponent } from './tabular-data-extract.component';

describe('TabularDataExtractComponent', () => {
  let component: TabularDataExtractComponent;
  let fixture: ComponentFixture<TabularDataExtractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabularDataExtractComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabularDataExtractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
