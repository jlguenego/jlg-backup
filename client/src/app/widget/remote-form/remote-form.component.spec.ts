import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoteFormComponent } from './remote-form.component';

describe('RemoteFormComponent', () => {
  let component: RemoteFormComponent;
  let fixture: ComponentFixture<RemoteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoteFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
