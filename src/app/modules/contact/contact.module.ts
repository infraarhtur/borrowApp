import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactRoutingModule } from './contact-routing.module';
import { CreateComponent } from './components/create/create.component';
import { ListComponent } from './components/list/list.component';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DetailComponent } from './components/detail/detail.component';
import { DebtModule } from '../debt/debt.module';
import { PaymentModule } from '../payment/payment.module';



@NgModule({
  declarations: [
    CreateComponent,
    ListComponent,
    DetailComponent
  ],
  imports: [
    CommonModule,
    ContactRoutingModule,
    MaterialModule,
    ReactiveFormsModule,DebtModule, PaymentModule

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ContactModule { }
