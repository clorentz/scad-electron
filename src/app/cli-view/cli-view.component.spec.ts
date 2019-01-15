import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CliViewComponent } from './cli-view.component';

describe('CliViewComponent', () => {
  let component: CliViewComponent;
  let fixture: ComponentFixture<CliViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CliViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CliViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
