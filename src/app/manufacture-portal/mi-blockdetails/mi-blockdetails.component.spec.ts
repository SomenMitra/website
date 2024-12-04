import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiBlockdetailsComponent } from './mi-blockdetails.component';

describe('MiBlockdetailsComponent', () => {
  let component: MiBlockdetailsComponent;
  let fixture: ComponentFixture<MiBlockdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiBlockdetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiBlockdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
