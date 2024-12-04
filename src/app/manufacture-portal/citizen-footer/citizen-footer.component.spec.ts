import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitizenFooterComponent } from './citizen-footer.component';

describe('CitizenFooterComponent', () => {
  let component: CitizenFooterComponent;
  let fixture: ComponentFixture<CitizenFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CitizenFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CitizenFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
