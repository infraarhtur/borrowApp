import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatedPaymentComponent } from './components/created-payment/created-payment.component';
import { PaymentRoutingModule } from './payment-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { DialogAddPaymentComponent } from './components/dialog-add-payment/dialog-add-payment.component';
import { ListPaymentsByContactComponent } from './components/list-payments-by-contact/list-payments-by-contact.component';



@NgModule({
  declarations: [
    CreatedPaymentComponent,
    DialogAddPaymentComponent,
    ListPaymentsByContactComponent
  ],
  imports: [
    CommonModule,
    PaymentRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports:[
    CreatedPaymentComponent,
    ListPaymentsByContactComponent
  ],

})
export class PaymentModule { }
