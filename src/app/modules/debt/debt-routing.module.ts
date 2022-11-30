import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateDebtComponent } from './components/create-debt/create-debt.component';
import { DebtListComponent } from './components/debt-list/debt-list.component';
import { DetailDebtComponent } from './components/detail-debt/detail-debt.component';

const routes: Routes = [
  {
    path: '',
    component: CreateDebtComponent
  },
  {
    path: 'create',
    component: CreateDebtComponent
  },
  {
    path: 'list',
    component: DebtListComponent
  }
  ,
  {
    path: 'detail:id',
    component: DetailDebtComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})



export class DebtRoutingModule { }
