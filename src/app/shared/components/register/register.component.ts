import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { UsersInterface } from 'src/app/models/shared/users.interface';
import { CustomValidators } from 'src/app/functions/custom-validators';
// import { AuthFireService } from 'src/app/services/shared/auth-fire.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  formRegistroUser: FormGroup;
  hide = true;
  enviar: any;
  usuarioSeleccionado: UsersInterface;
  description = 'Registro';

  constructor(
    private _builders: FormBuilder,
    public dialogRef: MatDialogRef<RegisterComponent>,
    @Inject(MAT_DIALOG_DATA) public user: UsersInterface,

  ) { }

  ngOnInit(): void {
    this.RegistroFormGroup();
  }

  // tslint:disable-next-line: typedef
  cerrar() {

    if( this.formRegistroUser.valid){
      this.dialogRef.close(this.formRegistroUser.value);
    }else{
      this.dialogRef.close(false);
    }


    this.formRegistroUser.reset();
  }


  // tslint:disable-next-line: typedef
  crearNuevoUsuario() {

    if (this.formRegistroUser.invalid) { return; }

    const { name, lastName, email, pwd } = this.formRegistroUser.value;


    this.cerrar();
  }
  // tslint:disable-next-line: typedef
  agregarSubmit() {
    if (this.formRegistroUser.invalid) {
      return Object.values(this.formRegistroUser.controls).forEach(control => {
        control.markAllAsTouched();
      });
    }
  }

  // tslint:disable-next-line: typedef
  RegistroFormGroup() {
    this.formRegistroUser = this._builders.group({

      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      pwd: ['',
        [Validators.required,

        CustomValidators.patternValidator(/\d/, { hasNumber: true }),
        // 3. check whether the entered password has upper case letter
        CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
        // 4. check whether the entered password has a lower-case letter
        CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),

        Validators.minLength(8),
        ]],
      confirmPwd: ['', [Validators.required]]
    }, {
      // check whether our password and confirm password match
      validator: CustomValidators.passwordMatchValidator
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    // this.dataService.crearUsuario(this.user);
  }


}
