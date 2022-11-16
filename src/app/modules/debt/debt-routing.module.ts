import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateDebtComponent } from './components/create-debt/create-debt.component';

const routes: Routes = [
  {
    path: '',
    component: CreateDebtComponent
  },
  {
    path: 'create',
    component: CreateDebtComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})



export class DebtRoutingModule { }
