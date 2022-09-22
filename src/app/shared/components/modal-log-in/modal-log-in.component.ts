import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Login } from '../../../models/shared/login.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route, Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { RegisterComponent } from '../register/register.component';
import { ResetPasswordModalComponent } from '../reset-password-modal/reset-password-modal.component';
// import { AuthFireService } from 'src/app/services/shared/auth-fire.service';
// import { Store } from '@ngrx/store';
// import { AppState } from '../../../app.reducer';
// import * as ui from '../../ui.actions';
import { Subscription } from 'rxjs';
// import { AngularFirestore } from '@angular/fire/firestore';
import { CryptoJsService } from 'src/app/services/shared/crypto-js.service';


@Component({
  selector: 'app-modal-log-in',
  templateUrl: './modal-log-in.component.html',
  styleUrls: ['./modal-log-in.component.scss']
})
export class ModalLogInComponent implements OnInit {

  @Output() eventoSesion = new EventEmitter();
  public frmSesion: FormGroup;
  public objlogin: Login;
  public vistas: string[] = [];

  hide: boolean = true;
  messageErr: string = '';
  returnToken: any;
  cargando: boolean = false;
  uiSubscription: Subscription;

  constructor(
    public formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    public router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    // public authFireService: AuthFireService,
    // public store: Store<AppState>,
    // private fireStore: AngularFirestore,
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


    // this.uiSubscription = this.store.select('ui')
    //   .subscribe(ui => {

    //     this.cargando = ui.isLoading;
    //   });

   }

   ngOnInit(): void {
    // this.uiSubscription = this.store.select('ui')
    // .subscribe(ui => {
    //   this.cargando = ui.isLoading;
    // })
  }

  ngOnDestroy() {
    if (this.uiSubscription) {
      this.uiSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    document.getElementsByClassName('mat-card-header-text')[0].setAttribute('style', 'width: 100%');
  }

  PasswordResetModal() {}
  // PasswordResetModal() {
  //   const dialogComponent = new MatDialogConfig();
  //   dialogComponent.autoFocus = true;
  //   dialogComponent.disableClose = true;
  //   dialogComponent.data = {};
  //   const dialogRef = this.dialog.open(ResetPasswordModalComponent, dialogComponent);
  //   dialogRef.disableClose = true;
  //   dialogRef.afterClosed().subscribe(result => {

  //     if (result != false) {
  //       const { email } = result;
  //       // this.authFireService.passwordResetByEmail(email)
  //       //   .then(res => {
  //       //     console.log('email enviado:', res);
  //       //   }).catch(error => {
  //       //     if(error.code === 'auth/user-not-found'){
  //       //       this.openSnackBarError('Usuario no encontrado, no se puedo enviar el correo.','Cerrar');
  //       //     }
  //       //   })


  //     }
  //   });
  // }
  registrarUsuario() {

    const dialogComponent = new MatDialogConfig();
    dialogComponent.autoFocus = true;
    dialogComponent.disableClose = true;
    dialogComponent.data = {};
    const dialogRef = this.dialog.open(RegisterComponent, dialogComponent);
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {

      if (result != false) {


        const { name, lastName, email, pwd } = result;
        // this.authFireService.crearUsuario(name, lastName, email, pwd)
        //   .then(res => {

        //     this.iniciarSesionByregistro();
        //   })
      }
     });

  }

  signInGoogle(){
    // this.authFireService.authGoogleAccount().then(result => {
    //   localStorage.setItem('DisplayName', result.user.displayName);
    //   localStorage.setItem('PhotoURL', result.user.photoURL);

    //   let additionalUserInfo: any = result.additionalUserInfo.profile;

    //   if(result.additionalUserInfo.isNewUser){

    //     this.fireStore.collection('users').doc(result.user!.uid)
    //     .set({
    //       uid: result.user.uid,
    //       name: additionalUserInfo.given_name,
    //       lastName: additionalUserInfo.family_name,
    //       email: additionalUserInfo.email,
    //       rol: {
    //         id: 2,
    //         name: 'Client'
    //       }
    //     })
    //   }

    //   this.authFireService.getUserInfo(result.user!.uid).subscribe((res: any) => {
    //     res.forEach(doc => {
    //       const rolEncript = this.criptoService.encryptUsingAES256(doc.data().rol.name);
    //         localStorage.setItem('Rol', rolEncript);
    //     });
    //   });

    //   this.router.navigate(['/Catalogue']);
    //   this.iniciarSesionByregistro();
    //   this._snackBar.open('Bienvenido', 'Undo', {
    //     duration: 3000,
    //   });
    // })
    // .catch(err => {
    //   this.store.dispatch(ui.stopLoading());
    //     if(err.code === 'auth/popup-closed-by-user'){
    //       this.openSnackBarError('el ventana se ha cerrado antes de terminar la operación', 'Cerrar');
    //     }
    // });
  }

  openSnackBarError(message: string, action:string){
    this._snackBar.open(message, action,{
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
    if (this.frmSesion.invalid) { return; }

    // this.store.dispatch(ui.isLoading());

    // const { user, password } = this.frmSesion.value;
    // this.authFireService.loginUsuario(user, password)
    //   .then(user => {
    //     if(user.user.emailVerified){
    //       localStorage.setItem('IsIdentity', 'true');

    //       this.authFireService.getUserInfo(user.user!.uid).subscribe((res: any) => {
    //         res.forEach(doc => {
    //           console.log(doc.id);
    //             localStorage.setItem('Rol', doc.data().rol.name);
    //         });
    //       });

    //       this.eventoSesion.emit(true);

    //       this.store.dispatch(ui.stopLoading());

    //       this._snackBar.open('Bienvenido a Las Dos Ruedas','Cerrar');
    //       this.router.navigate(['/Catalogue']);
    //     }else{
    //       this._snackBar.open('Debes verificar el correo electronico','Cerrar');
    //       this.store.dispatch(ui.stopLoading());
    //     }
    //   })
    //   .catch(err => {
    //     this.store.dispatch(ui.stopLoading());
    //     if(err.code === 'auth/user-not-found'){
    //       this.openSnackBarError('Usuario no encontrado, registrate!', 'Cerrar');
    //     }
    //     else if(err.code === 'auth/wrong-password'){
    //       this.openSnackBarError('Usuario o contraseña incorrectos', 'Cerrar');
    //     }
    //   })

  }


  iniciarSesionByregistro() {
    localStorage.setItem('IsIdentity', 'true');
    this.eventoSesion.emit(true);
    this.router.navigate(['/Catalogue']);

    this._snackBar.open('Bienvenido', 'Undo', {
      duration: 3000,
    });

  }

  public errorHandling = (control: string, error: string) => {
    return this.frmSesion.controls[control].hasError(error);
  }





}


