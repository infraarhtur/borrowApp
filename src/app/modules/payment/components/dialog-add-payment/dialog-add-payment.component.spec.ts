import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddPaymentComponent } from './dialog-add-payment.component';

describe('DialogAddPaymentComponent', () => {
  let component: DialogAddPaymentComponent;
  let fixture: ComponentFixture<DialogAddPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAddPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAddPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
