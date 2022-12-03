import { Component, OnInit, Output, EventEmitter, OnDestroy, Inject} from '@angular/core';
import { FormGroup,  Validators ,FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DebtService } from 'src/app/services/business/debt.service';
import { UserService } from 'src/app/services/shared/user.service';
import { ContactService } from 'src/app/services/business/contact.service';
import { typeDebtEnum } from 'src/app/enums/typeDebt.enum';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/shared/snackbar.service';

@Component({
  selector: 'app-create-debt',
  templateUrl: './create-debt.component.html',
  styleUrls: ['./create-debt.component.scss']
})
export class CreateDebtComponent implements OnInit {
  public frmCreateDebt: FormGroup;
  userInfo:any;

  typeDebtEnumKeys = [];
  contactList = [];
  typeDebtList =[];

  constructor(
   private formBuilder: FormBuilder,
   private datePipe: DatePipe,
   private debtService: DebtService,
   private userService:UserService,
   private _contactService:ContactService,
   public router: Router,
   private _snackBarService: SnackbarService

  ) {
   this.validations();
   this.getTypeDebt();
   this.userInfo = this.userService.getUserLocal();
   }

  ngOnInit(): void {
    this.getContacts();
  }

  validations(){

    this.frmCreateDebt = this.formBuilder.group({
      isGroupDebt:false,
      debtValue:      [null, [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
      contacts:       [null, [Validators.required]],
      concept:        [null, [Validators.required]],
      typeDebt:       ['sinIntereses', [Validators.required]],
      isFixedFees:    [false],
      payDate:        [null, [Validators.required]],
      fixedInterest:  [null]

    });

    this.frmCreateDebt.get("typeDebt").valueChanges
      .subscribe(data=> {
        this.onchangetypeDebt();
      })
  }

 async createDebit(){

  if(this.frmCreateDebt.invalid){ return;}
    const objDebt = this.frmCreateDebt.value;
    const payDate = objDebt.payDate.getFullYear()+'/'+(objDebt.payDate.getMonth()+1)+'/'+objDebt.payDate.getDate();
    objDebt.payDate = payDate;

    const resp = await this.debtService.addDebt(this.userInfo.uid,objDebt);
    if(resp ===  undefined){
     this._snackBarService .customSnackbar('Deuda creada con exito', 'ok', 5000);
     this.router.navigate(['dashboard']);
    }
  }

 async getContacts(){
    const contacts =  await this._contactService.getContactsByUserId(this.userInfo.uid);

    contacts.forEach(item => {
      this.contactList.push({value :item.uid,viewValue :item.nickname});
    });

    this.contactList.sort((a,b) => a.viewValue > b.viewValue ? 1 : -1);
  }

  getTypeDebt() {
    this.typeDebtEnumKeys = Object.keys(typeDebtEnum).filter(f => f);
    this.typeDebtEnumKeys.forEach(item  => {
      this.typeDebtList.push({value: item, viewValue: typeDebtEnum[item]});
    });
    this.typeDebtList.sort((a,b) => a.viewValue > b.viewValue ? 1 : -1);
  }

  onchangetypeDebt(){
    if(this.frmCreateDebt.get('typeDebt').value ==='interesFijo'){
      this.frmCreateDebt.controls['fixedInterest']
      .setValidators([
        Validators.required,
        Validators.pattern(/^[0-9]\d*$/),
        Validators.maxLength(2)
      ]);
     }

  }
}

