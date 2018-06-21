import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoresEditComponent } from './shores-edit.component';

describe('ShoresEditComponent', () => {
  let component: ShoresEditComponent;
  let fixture: ComponentFixture<ShoresEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoresEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoresEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
