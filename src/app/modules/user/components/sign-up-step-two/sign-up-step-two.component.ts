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


  formSignUpStep2: FormGroup;
  description = 'Completar Registro';
  users: User[] = []
  constructor(
    private _userService: UserService,
    private _builders: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  // tslint:disable-next-line: typedef
  formValidations() {
    this.formSignUpStep2 = this._builders.group({

      indicative: this._builders.control('+', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(4),

      ]),
      cellPhone: this._builders.control('', [
        Validators.required,
        Validators.minLength(7),
      ]),

      Nickname: this._builders.control('', [
        Validators.required,
        Validators.minLength(5),
      ]),


    });
  }

  async addUser() {
    let user: User = {
      email: 'infraarhtur@gmail.com',
      nickname: 'Arhtur',
      phoneNumber:'3208965783',
      indicative: '+57',
      isTermsConditions: false,
      rol:'Client',
      emailVerified:false,
      photoURL:''
    }
    const resp = await this._userService.addUser(user)
    console.log('respuesta', resp)
  }

  getAllUsers() {
    this._userService.getUsers().subscribe(
      (result) => { this.users = result })
  }

  async  deleteUser(){
    const resp = await this._userService.deleteUser('wuj0vIeuK9ylqUdk1yot')
    console.log('respuesta delete', resp)
  }

}
