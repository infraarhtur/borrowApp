import { Component, OnInit,Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DebtService } from 'src/app/services/business/debt.service';
import { PaymentService } from 'src/app/services/business/payment.service';
import { SnackbarService } from 'src/app/services/shared/snackbar.service';
import { UserService } from 'src/app/services/shared/user.service';

@Component({
  selector    : 'app-dialog-add-payment',
  templateUrl : './dialog-add-payment.component.html',
  styleUrls   : ['./dialog-add-payment.component.scss']
})
export class DialogAddPaymentComponent implements OnInit {
  @ViewChild('txtValuePayment') valuePaymentElement: ElementRef;
  public frmAddPayment: FormGroup;
  public debt;
  public user;
  public idContact;
  public debtId      = '';
  public validateVal = 0;
  public title: string;

  constructor(
    private _formBuilder:     FormBuilder,
    public router:            Router,
    private _route:           ActivatedRoute,
    private _paymentServices: PaymentService,
    private _userService:     UserService,
    private _snackBarService: SnackbarService,
    public dialogRef:         MatDialogRef<DialogAddPaymentComponent>,
    private _debtService:     DebtService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.validations();
   }

  ngOnInit(): void {
    this.idContact  = this.data.contactId;
    this.debt       = this.data.debt;
    this.user       = this._userService.getUserLocal();
    let keys        = Object.keys(this.data);
    this.debtId     = keys.includes('debtId')? this.data.debtId:'';
    this.validateVal= keys.includes('debtId')?
                      this.debt.totalValue-this.debt.sumPaid
                      :this.data.totalCalculate;
    this.title      = keys.includes('debtId')? 'Pago especifico':'Pago general';
   setTimeout(() => {
    this.validations();
    this.valuePaymentElement.nativeElement.focus();
   }, 1500);

  }

  ok(oPayment){
    this._paymentServices.verifyPaymentsByIdUserWithSession();
    this.dialogRef.close({oPayment,oDebt: this.debt});
  }

  cancel(){
    this.dialogRef.close(false);
  }

  addPayment(){
    if(this.frmAddPayment.invalid){ return;}
    const objPayment        = this.frmAddPayment.value;
    objPayment.idContact    = this.idContact;
    objPayment.typePayment  = this.debtId === '' ? 'General' : 'Especific';
    objPayment.debtId       = this.debtId;
    objPayment.isPaid       = this.validateVal === objPayment.valuePayment? true:false;

    objPayment.idsGeneral = objPayment.typePayment === 'General'?
                            this._debtService.getIdDebtsForGeneralPay( this.user.id, objPayment.valuePayment, this.idContact)
                            :undefined;

    this._paymentServices.addPayment(this.user.uid,objPayment);
    this.frmAddPayment.reset();
    this._snackBarService.customSnackbar('Pago agregado correctamente','ok', 5000);
    localStorage.removeItem('payments');
    this.ok(objPayment);
  }

  validations(){
    this.frmAddPayment = this._formBuilder.group({
      commentPayment:  [null, [Validators.maxLength(100)]],
      valuePayment:    [null, [Validators.required,
                               Validators.pattern(/^[0-9]\d*$/),
                               Validators.max(this.validateVal)]],
      isPaid:           [false ]
    });
  }
  changePaid(event){
    const val = event.checked?this.validateVal:null;
    this.frmAddPayment.controls['valuePayment'].setValue(val);
  }


}
