import { Injectable, NgZone } from '@angular/core';
import { User } from '../../models/shared/user';
import { Auth,
  createUserWithEmailAndPassword,
   signInWithEmailAndPassword,
   signOut, signInWithPopup, GoogleAuthProvider} from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any; // Save logged in user data

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    private _snackBarServices: SnackbarService,
    private auth:Auth
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  // Sign in with email/password
  SignIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password) .then((result) => {
      this.SetUserData(result.user);
      this.afAuth.authState.subscribe((user) => {
        if (user) {
          console.log('user', user);
          localStorage.setItem('IsIdentity', 'true');
          this._snackBarServices.customSnackbar('Bienvendo!!', 'info', 5000)
          location.pathname = '/dashboard';
        }
      });
    })
    .catch((error) => {
       this.snackBarMessage(error.message);
    });

  }
  // Sign up with email/password
  SignUp(email: string, password: string) {
    debugger
    return createUserWithEmailAndPassword(this.auth,email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        debugger;
        this.SendVerificationMail();
        this.SetUserData(result.user);
      })
      .catch((error) => {

        this._snackBarServices.customSnackbar(error.message,'error')

      });
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this._snackBarServices.customSnackbar('Verifica tu email', 'info', 10000);
      });
  }
  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    let route = window.location.href.toString();

    var actionCodeSettings = {
      // After password reset, the user will be give the ability to go back
      // to this page.
      url: route,
      handleCodeInApp: false
    }
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail, actionCodeSettings)
      .then(() => {
        this._snackBarServices.customSnackbar('Password reset email sent, check your inbox.', 'info');

      })
      .catch((error) => {
        this._snackBarServices.customSnackbar(error, 'info')

      });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }
  // Sign in with Google
  GoogleAuth() {
    return signInWithPopup(this.auth, new GoogleAuthProvider ())
    .then((res: any) => {
        localStorage.setItem('IsIdentity', 'true');
        location.pathname = '/dashboard';
      });
      }
  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.router.navigate(['dashboard']);
        this.SetUserData(result.user);
      })
      .catch((error) => {
        this._snackBarServices.customSnackbar(error,'error')
      });
  }

  /* Setting up user data when sign in with username/password,
    sign up with username/password and sign in with social auth
    provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }
  // Sign out
  SignOut() {
    return signOut(this.auth).then(() => {
      localStorage.removeItem('user');
      localStorage.clear();
      window.localStorage.clear();
      this.router.navigate(['sign-in'])
        .then(() => {
          location.reload();
        });
    });
  }

  snackBarMessage(error) {

    if (error.includes('auth/invalid-email')) {
      this._snackBarServices.customSnackbar('invalid-email','error',10000);

    } else if (error.includes('auth/network-request-failed')) {
      this._snackBarServices.customSnackbar('network-request-failed','error', 10000);

    } else if (error.includes('password')) {

      this._snackBarServices.customSnackbar('wrong-password','error', 10000);
    } else {
      this._snackBarServices.customSnackbar(error,'error', 10000);

    }
  }

  getDataUser(){
     return JSON.parse(localStorage.getItem('user')!)
  }




}
