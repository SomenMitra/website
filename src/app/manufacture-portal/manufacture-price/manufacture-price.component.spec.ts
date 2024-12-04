import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPriceComponent } from './manufacture-price.component';

describe('ManufacturePriceComponent', () => {
  let component: ItemPriceComponent;
  let fixture: ComponentFixture<ManufacturePriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManufacturePriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
