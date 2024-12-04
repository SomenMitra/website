import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureReapplyComponent } from './manufacture-reapply.component';

describe('ManufactureReapplyComponent', () => {
  let component: ManufactureReapplyComponent;
  let fixture: ComponentFixture<ManufactureReapplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManufactureReapplyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureReapplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
