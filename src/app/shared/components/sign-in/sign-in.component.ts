import { Component, OnInit, Output, EventEmitter, OnDestroy, Inject, } from '@angular/core';
import { AuthService } from 'src/app/services/shared/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Login } from '../../../models/shared/login.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route, Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { CryptoJsService } from 'src/app/services/shared/crypto-js.service';
import { Subscription } from 'rxjs/';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.reducer';
import { ResetPasswordModalComponent } from '../reset-password-modal/reset-password-modal.component';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ResendVerifyEmailModalComponent } from '../resend-verify-email-modal/resend-verify-email-modal.component';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, OnDestroy {
  @Output() eventoSesion = new EventEmitter();
  public frmSesion: FormGroup;
  public objlogin: Login;
  cargando: boolean = false;
  returnToken: any;
  hide: boolean = true;
  messageErr: string = '';
  forgotPasswordModal: ResetPasswordModalComponent;
  signUpModal: SignUpComponent;
  uiSubscription: Subscription;
  userData: any;
  resendEmail:ResendVerifyEmailModalComponent;

  constructor(
    public authService: AuthService,
    public formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    public router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public store: Store<AppState>,
    private criptoService: CryptoJsService,
    public afAuth: AngularFireAuth, // Inject Firebase auth service

  ) {

    this.clearSession();


    this.objlogin = { user: '', password: '' };
    this.frmSesion = this.formBuilder.group({
      user: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(5),
      ]),
      password: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(5),
      ]),
    });

    this.uiSubscription = this.store.select('ui')
      .subscribe(ui => {

        this.cargando = ui.isLoading;
      });
  }
  ngOnInit(): void {

  }

  ngOnDestroy() {
    if (this.uiSubscription) {
      this.uiSubscription.unsubscribe();
    }
  }

  clearSession(){
    if(localStorage.getItem('user') !== 'null'){
      this.authService.SignOut();
    }
  }


  // tslint:disable-next-line: typedef
  validaciones() {
    this.frmSesion = this.formBuilder.group({
      user: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(5),
      ]),
      password: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(5),
      ]),
    });
  }


  public errorHandling = (control: string, error: string) => {
    return this.frmSesion.controls[control].hasError(error);
  }

  async SignIn() {
    if (this.frmSesion.invalid) { return; }

   const result = await this.authService.SignIn(
      this.frmSesion.controls['user'].value,
      this.frmSesion.controls['password'].value);

      if(result !== undefined){
        this.resendEmailModalOpen(result)
      }
  }



  GoogleAuth() {
    this.authService.GoogleAuth()
    setTimeout(() => {
      if (localStorage.getItem('IsIdentity') === 'true') {

        this.eventoSesion.emit(false);
        this.router.navigate(['dashboard']);
      }

    }, 3000);
  }

  forgotPasswordModalOpen() {
    const dialogComponent = new MatDialogConfig();
    dialogComponent.autoFocus = true;
    dialogComponent.disableClose = true;
    dialogComponent.data = '';
    const dialogRef = this.dialog.open(ResetPasswordModalComponent, dialogComponent);
    dialogRef.disableClose = true;
  }

  signUpModalOpen() {
    const dialogComponent = new MatDialogConfig();
    dialogComponent.autoFocus = true;
    dialogComponent.disableClose = true;
    dialogComponent.data = '';
    const dialogRef = this.dialog.open(SignUpComponent, dialogComponent);
    dialogRef.disableClose = true;
  }

  resendEmailModalOpen(user){
    const dialogComponent = new MatDialogConfig();
    dialogComponent.autoFocus = true;
    dialogComponent.disableClose = true;
    dialogComponent.data = user;
    dialogComponent.panelClass = 'custom-modalbox';
    dialogComponent.enterAnimationDuration = '1500ms';
    dialogComponent.exitAnimationDuration = '1500ms'

    const dialogRef = this.dialog.open(ResendVerifyEmailModalComponent, dialogComponent,);
    dialogRef.disableClose = true;
  }
}

