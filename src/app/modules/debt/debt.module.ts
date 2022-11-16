import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebtRoutingModule } from './debt-routing.module';
import { CreateDebtComponent } from './components/create-debt/create-debt.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material/material.module';


@NgModule({
  declarations: [
    CreateDebtComponent
  ],
  imports: [
    CommonModule,
    DebtRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
  ]
})
export class DebtModule { }
