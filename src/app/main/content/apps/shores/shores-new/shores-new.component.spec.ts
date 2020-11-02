import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoresNewComponent } from './shores-new.component';

describe('ShoresNewComponent', () => {
  let component: ShoresNewComponent;
  let fixture: ComponentFixture<ShoresNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoresNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoresNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
