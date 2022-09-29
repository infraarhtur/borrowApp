import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/shared/auth.service';
import { UsersInterface } from 'src/app/models/shared/users.interface';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  formSignUp: FormGroup;
  description = 'Registro ';
  hide: boolean = true;
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
    debugger;
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
  });
}


  public errorHandling = (control: string, error: string) => {
    return this.formSignUp.controls[control].hasError(error);
  }
}
