import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './shared/components/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './shared/components/forgot-password/forgot-password.component';
import { SignInComponent } from './shared/components/sign-in/sign-in.component';
import { SignUpComponent } from './shared/components/sign-up/sign-up.component';



const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent },
  { path: 'register-user', component: SignUpComponent },
  { path: 'dashboard', component: DashboardComponent,  canActivate: [AuthGuard]  },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {
    path: 'user',
    canActivate: [
      AuthGuard
    ],
    loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule)
  },{
    path: 'debt',
    canActivate: [
      AuthGuard
    ],
    loadChildren: () => import('./modules/debt/debt.module').then(m => m.DebtModule)
  }
  ,{
    path: 'contact',
    canActivate: [
      AuthGuard
    ],
    loadChildren: () => import('./modules/contact/contact.module').then(m => m.ContactModule)
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
