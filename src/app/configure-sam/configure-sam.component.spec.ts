import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureSamComponent } from './configure-sam.component';

describe('ConfigureSamComponent', () => {
  let component: ConfigureSamComponent;
  let fixture: ComponentFixture<ConfigureSamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigureSamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureSamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
