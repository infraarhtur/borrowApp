import { Injectable, NgZone } from '@angular/core';
import { User } from '../../models/shared/user';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut, signInWithPopup, GoogleAuthProvider, sendEmailVerification
} from '@angular/fire/auth';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import { UserService } from './user.service';
import { UserModel } from 'src/app/models/shared/user.model';
import { getDoc } from 'firebase/firestore';
import { CryptoJsService } from 'src/app/services/shared/crypto-js.service';

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
    private auth: Auth,
    private _userService: UserService,
    private criptoService: CryptoJsService,
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user',this.criptoService.encryptUsingAES256(JSON.stringify(this.userData)) );
        JSON.parse(this.criptoService.decryptUsingAES256(localStorage.getItem('user'))!);

      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  // Sign in with email/password
  SignIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password).then((result) => {
      if (!result.user.emailVerified) {
        return result.user;
      }
      this.afAuth.authState.subscribe((user) => {
        if (user) {
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

    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((result) => {

        const user: User = {
          uid: result.user.uid,
          email: result.user.email,
          nickname: null,
          phoneNumber: result.user.phoneNumber,
          indicative: null,
          isTermsConditions: false,
          rol: 'Client',
          emailVerified: result.user.emailVerified,
          photoURL: result.user.photoURL
        }
        this.SendVerificationMail();
        this._userService.addUser(user)
      })
      .catch((error) => {
        this._snackBarServices.customSnackbar(error.message, 'error');
      });
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this._snackBarServices.customSnackbar('listo! verifica tu email', 'info', 10000);
      });
  }

  async sendEmailVerificationWithUser(user) {
    try {
      const result = await sendEmailVerification(user);
      if (result === undefined) {
        this._snackBarServices.customSnackbar('listo! verifica tu email', 'info', 10000);
      }
      return true;
    } catch (error) {
      this._snackBarServices.customSnackbar('Lo sentimos tuvimos un error enviando el correo', 'error', 10000);
      return;
    }
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
        this._snackBarServices.customSnackbar(error, 'info');
      });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(this.criptoService.decryptUsingAES256(localStorage.getItem('user'))!);
    return user !== null && user.emailVerified !== false ? true : false;
  }
  // Sign in with Google
  async GoogleAuth() {
    const result = await signInWithPopup(this.auth, new GoogleAuthProvider());
    const docSnap = await this._userService.getInfoDoc(result.user.uid);

    if (!docSnap.exists()) {
      const user: User = {
        uid: result.user.uid,
        email: result.user.email,
        nickname: result.user.displayName,
        phoneNumber: result.user.phoneNumber,
        indicative: null,
        isTermsConditions: false,
        rol: 'Client',
        emailVerified: result.user.emailVerified,
        photoURL: result.user.photoURL
      }
      const isCreated = await this._userService.addUser(user)

    }
    localStorage.setItem('IsIdentity', 'true');
    location.pathname = '/dashboard';
  }

  SignOut() {
    return signOut(this.auth).then(() => {
      localStorage.removeItem('user');
      localStorage.clear();
      window.localStorage.clear();
      location.pathname = '/sign-in';
      this.router.navigate(['sign-in'])
        .then(() => {
          location.reload();
        });
    });
  }

  snackBarMessage(error) {

    if (error.includes('auth/invalid-email')) {
      this._snackBarServices.customSnackbar('invalid-email', 'error', 10000);

    } else if (error.includes('auth/network-request-failed')) {
      this._snackBarServices.customSnackbar('network-request-failed', 'error', 10000);

    } else if (error.includes('password')) {

      this._snackBarServices.customSnackbar('wrong-password', 'error', 10000);
    } else {
      this._snackBarServices.customSnackbar(error, 'error', 10000);

    }
  }

  getDataUser() {
    return JSON.parse(this.criptoService.decryptUsingAES256(localStorage.getItem('user'))!)
  }


}
