import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BottlesEditComponent } from './bottles-edit.component';

describe('BottlesEditComponent', () => {
  let component: BottlesEditComponent;
  let fixture: ComponentFixture<BottlesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottlesEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottlesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
