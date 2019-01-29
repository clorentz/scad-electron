import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileRightsComponent } from './file-rights.component';

describe('FileRightsComponent', () => {
  let component: FileRightsComponent;
  let fixture: ComponentFixture<FileRightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileRightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileRightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
