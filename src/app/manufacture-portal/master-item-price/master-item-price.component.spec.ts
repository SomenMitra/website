import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterItemPriceComponent } from './master-item-price.component';

describe('MasterItemPriceComponent', () => {
  let component: MasterItemPriceComponent;
  let fixture: ComponentFixture<MasterItemPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterItemPriceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterItemPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
