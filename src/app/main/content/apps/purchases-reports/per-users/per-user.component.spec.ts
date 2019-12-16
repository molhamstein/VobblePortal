import { PerUserComponent } from './per-user.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';


describe('PerUserComponent', () => {
  let component: PerUserComponent;
  let fixture: ComponentFixture<PerUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
