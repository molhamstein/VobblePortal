import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsNewComponent } from './items-new.component';

describe('ItemsNewComponent', () => {
  let component: ItemsNewComponent;
  let fixture: ComponentFixture<ItemsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
