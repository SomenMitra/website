import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturePortaComponent } from './manufacture-porta.component';

describe('ManufacturePortaComponent', () => {
  let component: ManufacturePortaComponent;
  let fixture: ComponentFixture<ManufacturePortaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManufacturePortaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufacturePortaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
