import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditPaymentComponent } from './dialog-edit-payment.component';

describe('DialogEditPaymentComponent', () => {
  let component: DialogEditPaymentComponent;
  let fixture: ComponentFixture<DialogEditPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEditPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogEditPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
