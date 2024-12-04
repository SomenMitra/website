import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdishaonelogoutComponent } from './odishaonelogout.component';

describe('OdishaonelogoutComponent', () => {
  let component: OdishaonelogoutComponent;
  let fixture: ComponentFixture<OdishaonelogoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OdishaonelogoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OdishaonelogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
