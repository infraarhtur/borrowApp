import { Component, OnInit, Inject } from '@angular/core';
import { CustomValidators } from 'src/app/functions/custom-validators';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/services/shared/user.service';
import { User } from 'src/app/models/shared/user';
import { SnackbarService } from 'src/app/services/shared/snackbar.service';
import { AuthService } from 'src/app/services/shared/auth.service';
import { DialogDynamicTextComponent } from 'src/app/shared/components/dialog-dynamic-text/dialog-dynamic-text.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sign-up-step-two',
  templateUrl: './sign-up-step-two.component.html',
  styleUrls: ['./sign-up-step-two.component.scss']
})
export class SignUpStepTwoComponent implements OnInit {

  firstFormGroup = this._formBuilder.group({

    acceptTerms: [false, Validators.requiredTrue]
  });


  secondFormGroup = this._formBuilder.group({
    nickName: [null, [Validators.required]],
    numberPhone: [null, [Validators.required, Validators.pattern("[0-9]{10}")]],
    indicative: [null, [Validators.required, Validators.pattern("[0-9]{2}")]]
  });
  isLinear = true;

  formSignUpStep2: FormGroup;
  description = 'Completar Registro';
  users: User[] = []
  panelOpenState = true;
  aditionalDta:any;
  nickName
  userid
  constructor(
    private _userService: UserService,
    private _builders: FormBuilder,
    private _formBuilder: FormBuilder,
    private _snackBarService:SnackbarService,
    private _auth:AuthService,
    public dialog: MatDialog,
    public router: Router,

  ) { }

  ngOnInit(): void {

     this.aditionalDta =this._userService.getAditionalData()
     this.nickName = this.aditionalDta.nickname;
     this.userid = this.aditionalDta.uid;

  }
  public errorHandling = (control: string, error: string) => {
    return this.firstFormGroup.controls[control].hasError(error);
  }

  public errorHandling2 = (control: string, error: string) => {
    return this.formSignUpStep2.controls[control].hasError(error);
  }

  onSumit1() {
    if (this.firstFormGroup.invalid) {
      return;
    }
  }

  async updateInfo() {

    if (this.secondFormGroup.invalid) {
      return;
    }
    const result = await this._userService.updateInfoUser(
      this.aditionalDta.uid, {
      isTermsConditions: this.firstFormGroup.controls.acceptTerms.value,
      nickname: this.secondFormGroup.controls.nickName.value,
      indicative: this.secondFormGroup.controls.indicative.value,
      phoneNumber: this.secondFormGroup.controls.numberPhone.value
    })

    if(result === undefined){
      this._snackBarService.customSnackbar('Felicitaciones Completaste el registro','ok',5000)
      this.router.navigate(['dashboard']);
    }
  }


  cancelAndOut(){

    this.confirmModalOpen('¿estás seguro que quieres salir y no terminar el registro? ')

  }


  confirmModalOpen(message) {
    const dialogComponent = new MatDialogConfig();
    dialogComponent.autoFocus = true;
    dialogComponent.disableClose = true;
    dialogComponent.data = {msj :message ,
       btnCancel: 'Si, deseo salir' ,
      btnOk : 'Deseo continuar el registro',
      title: 'Confirmación'

      };
    dialogComponent.panelClass = 'custom-modalbox';
    dialogComponent.enterAnimationDuration = '1000ms';
    dialogComponent.exitAnimationDuration = '1000ms'
    const dialogRef = this.dialog.open(DialogDynamicTextComponent, dialogComponent);
    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe(result => {

      if(!result){
        this._auth.SignOut();
      }else{
        return
      }
    });
  }

}
