import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedDbtApplyComponent } from './seed-dbt-apply.component';

describe('SeedDbtApplyComponent', () => {
  let component: SeedDbtApplyComponent;
  let fixture: ComponentFixture<SeedDbtApplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeedDbtApplyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeedDbtApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
