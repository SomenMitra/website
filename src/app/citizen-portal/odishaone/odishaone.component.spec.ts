import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdishaoneComponent } from './odishaone.component';

describe('OdishaoneComponent', () => {
  let component: OdishaoneComponent;
  let fixture: ComponentFixture<OdishaoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OdishaoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OdishaoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
