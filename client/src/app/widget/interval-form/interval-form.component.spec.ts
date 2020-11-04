import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntervalFormComponent } from './interval-form.component';

describe('IntervalFormComponent', () => {
  let component: IntervalFormComponent;
  let fixture: ComponentFixture<IntervalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntervalFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntervalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
