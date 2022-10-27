import { Component, OnInit, Inject } from '@angular/core';
import { CustomValidators } from 'src/app/functions/custom-validators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/services/shared/user.service';
import { User } from 'src/app/models/shared/user';


@Component({
  selector: 'app-sign-up-step-two',
  templateUrl: './sign-up-step-two.component.html',
  styleUrls: ['./sign-up-step-two.component.scss']
})
export class SignUpStepTwoComponent implements OnInit {

  firstFormGroup = this._formBuilder.group({

    acceptTerms: [false,  Validators.requiredTrue]
  });
  secondFormGroup = this._formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    numberPhone:[null, [Validators.required, Validators.pattern("[0-9]{10}")]],
    indicative: [null, [Validators.required,Validators.pattern("[0-9]{2}")]]
  });
  isLinear = true;

  formSignUpStep2: FormGroup;
  description = 'Completar Registro';
  users: User[] = []
  panelOpenState = true;
  constructor(
    private _userService: UserService,
    private _builders: FormBuilder,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

  }
  public errorHandling = (control: string, error: string) => {
    return this.firstFormGroup.controls[control].hasError(error);
  }

  public errorHandling2 = (control: string, error: string) => {
    return this.formSignUpStep2.controls[control].hasError(error);
  }

onSumit1(){
  if (this.firstFormGroup.invalid) {
    return;
}
}
}
