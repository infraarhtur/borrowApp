import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebtRoutingModule } from './debt-routing.module';
import { CreateDebtComponent } from './components/create-debt/create-debt.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { DebtListComponent } from './components/debt-list/debt-list.component';
import { DetailDebtComponent } from './components/detail-debt/detail-debt.component';


@NgModule({
  declarations: [
    CreateDebtComponent,
    DebtListComponent,
    DetailDebtComponent
  ],
  imports: [
    CommonModule,
    DebtRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
  ],exports:[
    CreateDebtComponent,
    DebtListComponent,
    DetailDebtComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class DebtModule { }
