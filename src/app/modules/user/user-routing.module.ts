import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SignUpStepTwoComponent } from './components/sign-up-step-two/sign-up-step-two.component';


const routes: Routes = [
  {
    path: '',
    component: SignUpStepTwoComponent
  },
  {
    path: 'sign-up-step-2',
    component: SignUpStepTwoComponent
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

export class UserRoutingModule { }
