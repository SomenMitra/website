import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureApplyComponent } from './manufacture-apply.component';

describe('ManufactureApplyComponent', () => {
  let component: ManufactureApplyComponent;
  let fixture: ComponentFixture<ManufactureApplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManufactureApplyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
