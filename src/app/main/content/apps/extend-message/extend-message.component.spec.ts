import { ExtendMessageComponent } from './extend-message.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';


describe('ExtendMessageComponent', () => {
  let component: ExtendMessageComponent;
  let fixture: ComponentFixture<ExtendMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtendMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
