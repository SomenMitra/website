import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitizenHeaderComponent } from './citizen-header.component';

describe('CitizenHeaderComponent', () => {
  let component: CitizenHeaderComponent;
  let fixture: ComponentFixture<CitizenHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CitizenHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CitizenHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
