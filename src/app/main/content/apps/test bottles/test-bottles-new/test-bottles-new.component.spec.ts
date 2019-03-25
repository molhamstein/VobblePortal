import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BottlesNewComponent } from './bottles-new.component';

describe('BottlesNewComponent', () => {
  let component: BottlesNewComponent;
  let fixture: ComponentFixture<BottlesNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottlesNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottlesNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
