import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/shared/auth.service';
import { UsersInterface } from 'src/app/models/shared/users.interface';
import { CustomValidators } from 'src/app/functions/custom-validators';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  formSignUp: FormGroup;
  description = 'Registro ';
  hide: boolean = true;
  hideConfirm: boolean = true;
  constructor(
    private _builders: FormBuilder,
    public dialogRef: MatDialogRef<SignUpComponent>,
    @Inject(MAT_DIALOG_DATA) public user: UsersInterface,
    public authService: AuthService
  ) {

    this.formValidations();
  }

  ngOnInit(): void {
  }

  close() {
    if( this.formSignUp.valid){
      this.dialogRef.close(this.formSignUp.value);
    }else{
      this.dialogRef.close(false);
    }
    this.formSignUp.reset();
  }

  signUp(){

    if (this.formSignUp.invalid) { return; }
    const {email, password} = this.formSignUp.value;
    this.authService.SignUp(email, password)

    this.close();
  }

  // tslint:disable-next-line: typedef
formValidations() {
  this.formSignUp = this._builders.group({
    email: this._builders.control('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    password: this._builders.control('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    confirmPassword: this._builders.control('', [
      Validators.required,
      Validators.minLength(5),
    ]),
  },  {

      validators: [CustomValidators.match('password', 'confirmPassword')],

  });
}

  public errorHandling = (control: string, error: string) => {
    return this.formSignUp.controls[control].hasError(error);
  }
}
