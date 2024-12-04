import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBoqComponent } from './update-boq.component';

describe('UpdateBoqComponent', () => {
  let component: UpdateBoqComponent;
  let fixture: ComponentFixture<UpdateBoqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateBoqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateBoqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
