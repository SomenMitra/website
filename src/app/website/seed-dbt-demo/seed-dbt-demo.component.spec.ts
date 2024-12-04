import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedDbtDemoComponent } from './seed-dbt-demo.component';

describe('SeedDbtDemoComponent', () => {
  let component: SeedDbtDemoComponent;
  let fixture: ComponentFixture<SeedDbtDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeedDbtDemoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeedDbtDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
