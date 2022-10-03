import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//components material
import { MaterialModule } from './shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainComponent } from './shared/components/main/main.component';
import { HomeComponent } from './shared/components/home/home.component';
//#region proveedores externos
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ResetPasswordModalComponent } from './shared/components/reset-password-modal/reset-password-modal.component';

//
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import {appReducers} from './app.reducer';

import { AngularFireModule} from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { DashboardComponent } from './shared/components/dashboard/dashboard.component';
import { SignInComponent } from './shared/components/sign-in/sign-in.component';
import { SignUpComponent } from './shared/components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './shared/components/forgot-password/forgot-password.component';
import { AuthService } from './services/shared/auth.service';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { CustomSnackbarComponent } from './shared/components/custom-snackbar/custom-snackbar.component';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { UserModule } from './modules/user/user.module';

export function playerFactory() {
  return player;
}
@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HomeComponent,
    ResetPasswordModalComponent,
    DashboardComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    CustomSnackbarComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    FontAwesomeModule,

    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,

    StoreModule.forRoot(appReducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    //firebase
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),

    provideAuth(() => getAuth()),
    LottieModule.forRoot({ player: playerFactory }),

    UserModule

  ],
  providers: [MaterialModule, AuthService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
