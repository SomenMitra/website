import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPaymentReceiptComponent } from './upload-payment-receipt.component';

describe('UploadPaymentReceiptComponent', () => {
  let component: UploadPaymentReceiptComponent;
  let fixture: ComponentFixture<UploadPaymentReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadPaymentReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadPaymentReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
