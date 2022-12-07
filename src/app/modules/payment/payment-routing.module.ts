import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CreatedPaymentComponent } from './components/created-payment/created-payment.component';


const routes: Routes = [
  {
    path: '',
    component: CreatedPaymentComponent
  },
  {
    path: 'create-payment',
    component: CreatedPaymentComponent
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
