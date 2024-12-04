import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateschemestatusComponent } from './updateschemestatus.component';

describe('UpdateschemestatusComponent', () => {
  let component: UpdateschemestatusComponent;
  let fixture: ComponentFixture<UpdateschemestatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateschemestatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateschemestatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
