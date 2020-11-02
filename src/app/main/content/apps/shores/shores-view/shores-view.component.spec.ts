import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoresViewComponent } from './shores-view.component';

describe('ShoresViewComponent', () => {
  let component: ShoresViewComponent;
  let fixture: ComponentFixture<ShoresViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoresViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoresViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
