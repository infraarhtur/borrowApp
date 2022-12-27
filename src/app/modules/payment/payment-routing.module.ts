import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CreatedPaymentComponent } from './components/created-payment/created-payment.component';
import { ListPaymentsByContactComponent } from './components/list-payments-by-contact/list-payments-by-contact.component';


const routes: Routes = [
  {
    path: '',
    component: CreatedPaymentComponent
  },
  {
    path: 'create-payment',
    component: CreatedPaymentComponent
  },
  {
    path: 'list-payment',
    component: ListPaymentsByContactComponent
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ]
})

export class PaymentRoutingModule { }
