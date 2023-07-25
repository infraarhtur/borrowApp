import { Component, OnInit, Output, EventEmitter, OnDestroy, Inject} from '@angular/core';
import { FormGroup,  Validators ,FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DebtService } from 'src/app/services/business/debt.service';
import { UserService } from 'src/app/services/shared/user.service';
import { ContactService } from 'src/app/services/business/contact.service';
import { typeDebtEnum } from 'src/app/enums/typeDebt.enum';
import { paymentCycleEnum } from 'src/app/enums/paymentCycle.enum';
import { ActivatedRoute,  Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/shared/snackbar.service';
import { EmailService } from 'src/app/services/business/email.service';

@Component({
  selector: 'app-create-debt',
  templateUrl: './create-debt.component.html',
  styleUrls: ['./create-debt.component.scss']
})
export class CreateDebtComponent implements OnInit {
  frmCreateDebt: FormGroup;
  userInfo:      any;
  contactParam = null;
  isDisabledPaymentDay = true;

  minDate = new Date(Date.now());
  maxDate = new Date(2030,0,1);

  typeDebtEnumKeys     = [];
  PaymentCicleEnumKeys = [];
  contactList          = [];
  typeDebtList         = [];
  PaymentCiclelist     = [];

  constructor(
   private formBuilder:     FormBuilder,
   private datePipe:        DatePipe,
   private debtService:     DebtService,
   private userService:     UserService,
   private _contactService: ContactService,
   public router:           Router,
   public activateRoute:    ActivatedRoute,
   private _snackBarService:SnackbarService,
   private _emailServices:  EmailService

  ) {
   this.validations();
   this.getTypeDebt();
   this.getPaymentCycle();
   this.userInfo = this.userService.getUserLocal();
   }

  ngOnInit(): void {
    this.validateQueryParams();
    this.getContacts();
  }

  validations(){

    this.frmCreateDebt = this.formBuilder.group({
      isGroupDebt:    [false],
      debtValue:      [null, [Validators.maxLength(8),Validators.required, Validators.pattern(/^[0-9]\d*$/)
                      ]],
      contacts:       [this.contactParam, [Validators.required]],
      concept:        [null, [Validators.required]],
      typeDebt:       ['sinIntereses', [Validators.required]],
      isFixedFees:    [false],
      payDate:        [null, [Validators.required]],
      fixedInterest:  [null],
      paymentCycle:   [null],
      numberFees:     [null],
      paymentDay:     [null]

    });

    this.frmCreateDebt.get("typeDebt").valueChanges
      .subscribe( data => {
        this.onchangetypeDebt();
      })
      this.frmCreateDebt.get("isFixedFees").valueChanges
      .subscribe( data => {

       this.onchangeisFixedFees();
      })
  }

 async createDebt(){

  if(this.frmCreateDebt.invalid){ return;}

    const objDebt = this.frmCreateDebt.value;
    const payDate = objDebt.payDate.getFullYear()+'/'+(objDebt.payDate.getMonth()+1)+'/'+objDebt.payDate.getDate();
    objDebt.payDate = payDate;
    const resp = await this.debtService.addDebt(this.userInfo.uid,objDebt);
    if(resp ===  undefined){

     let contactInfo = this._contactService.getContactbyIdContact(objDebt.contacts)
      this._emailServices.emailCreateDebt(this.userInfo,contactInfo,objDebt)
      localStorage.removeItem('debts');

     this._snackBarService .customSnackbar('Deuda creada con exito', 'ok', 5000);
     this.router.navigate(['contact/list']);
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

  getPaymentCycle(){
    this.PaymentCicleEnumKeys = Object.keys(paymentCycleEnum).filter(f => f);
    this.PaymentCicleEnumKeys.forEach(item  => {
      this.PaymentCiclelist.push({value: item, viewValue: paymentCycleEnum[item]});
    });
    this.PaymentCiclelist.sort((a,b) => a.viewValue > b.viewValue ? 1 : -1);
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

  onchangeisFixedFees(){

    if(this.frmCreateDebt.get('isFixedFees').value){

      this.frmCreateDebt.controls['paymentCycle']
      .setValidators([ Validators.required]);

      this.frmCreateDebt.controls['numberFees']
      .setValidators([
        Validators.required,
        Validators.pattern(/^[0-9]\d*$/),
        Validators.maxLength(2),
        Validators.max(99),
        Validators.min(1)
      ]);

      this.frmCreateDebt.controls['paymentDay']
      .setValidators([
        Validators.required,
        Validators.pattern(/^[0-9]\d*$/),
        Validators.maxLength(2),
        Validators.max(31),
        Validators.min(1)
      ]);
     }

  }

  validateQueryParams(){
    this.activateRoute.queryParams.subscribe(params => {
      if(params['contact']){
        this.contactParam = params['contact'];
        this.validations();
      }
    });
  }

  validationOnlyNumberAndLength(event, number) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar) || event.target.value.length > number ) {
        // invalid character, prevent input
        event.preventDefault();
    }
}

validationPress(event){
  event.preventDefault();
}
}

