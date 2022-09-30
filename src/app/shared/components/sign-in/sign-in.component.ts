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
import { CustomSnackbarComponent } from '../custom-snackbar/custom-snackbar.component';


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
  forgotPasswordModal:ResetPasswordModalComponent;
  signUpModal:SignUpComponent;
  uiSubscription: Subscription;


  constructor(
    public authService: AuthService,
    public formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    public router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public store: Store<AppState>,
    private criptoService: CryptoJsService
  ) {

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

ngOnDestroy(){
  if (this.uiSubscription) {
    this.uiSubscription.unsubscribe();
  }
}

openSnackBarError(message: string, action: string) {
  this._snackBar.open(message, action, {
    panelClass: ["snack-bar-error"]
  });
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

iniciarSesionFireAuth() {
  this._snackBar.open('Bienvenido a Las Dos Ruedas', 'Cerrar');
  if (this.frmSesion.invalid) { return; }
}

    public errorHandling = (control: string, error: string) => {
  return this.frmSesion.controls[control].hasError(error);
}

SignIn(){
  if (this.frmSesion.invalid) { return; }

  this.authService.SignIn(this.frmSesion.controls['user'].value,
    this.frmSesion.controls['password'].value)
}



GoogleAuth(){
  this.authService.GoogleAuth()
  setTimeout(() => {
    if (localStorage.getItem('IsIdentity') === 'true') {

      this.eventoSesion.emit(false);
      this.router.navigate(['dashboard']);
    }

  }, 3000);
}

forgotPasswordModalOpen(){
  const dialogComponent = new MatDialogConfig();
  dialogComponent.autoFocus = true;
  dialogComponent.disableClose = true;
  dialogComponent.data = '';
  const dialogRef = this.dialog.open(ResetPasswordModalComponent, dialogComponent);
  dialogRef.disableClose = true;
}

signUpModalOpen(){
  const dialogComponent = new MatDialogConfig();
  dialogComponent.autoFocus = true;
  dialogComponent.disableClose = true;
  dialogComponent.data = '';
  const dialogRef = this.dialog.open(SignUpComponent, dialogComponent);
  dialogRef.disableClose = true;
}

customSnackbar(){
  this._snackBar.openFromComponent(CustomSnackbarComponent, {duration:2000,
    data:{
      message: 'este es un ejemplo con el info ',
      type: 'ok'
  }})
}

warningSnackbar(){
  this._snackBar.openFromComponent(CustomSnackbarComponent, {
    duration:4000,
    data:{

      message: 'este es un ejemplo un mensaje',
      type: 'error'
  }})
}
}

