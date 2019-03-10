import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicsNewComponent } from './topics-new.component';

describe('TopicsNewComponent', () => {
  let component: TopicsNewComponent;
  let fixture: ComponentFixture<TopicsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicsNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
