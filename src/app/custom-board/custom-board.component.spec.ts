import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomBoardComponent } from './custom-board.component';

describe('CustomBoardComponent', () => {
  let component: CustomBoardComponent;
  let fixture: ComponentFixture<CustomBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
