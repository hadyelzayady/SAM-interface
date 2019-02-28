import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilenameDialogComponent } from './filename-dialog.component';

describe('FilenameDialogComponent', () => {
  let component: FilenameDialogComponent;
  let fixture: ComponentFixture<FilenameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilenameDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilenameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
