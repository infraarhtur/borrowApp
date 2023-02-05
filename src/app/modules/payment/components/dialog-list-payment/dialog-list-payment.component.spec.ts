import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogListPaymentComponent } from './dialog-list-payment.component';

describe('DialogListPaymentComponent', () => {
  let component: DialogListPaymentComponent;
  let fixture: ComponentFixture<DialogListPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogListPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogListPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
