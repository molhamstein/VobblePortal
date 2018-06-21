import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoresListComponent } from './shores-list.component';

describe('ShoresListComponent', () => {
  let component: ShoresListComponent;
  let fixture: ComponentFixture<ShoresListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoresListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoresListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
