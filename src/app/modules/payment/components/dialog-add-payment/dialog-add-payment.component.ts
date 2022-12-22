import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from 'src/app/services/business/payment.service';
import { SnackbarService } from 'src/app/services/shared/snackbar.service';
import { UserService } from 'src/app/services/shared/user.service';

@Component({
  selector: 'app-dialog-add-payment',
  templateUrl: './dialog-add-payment.component.html',
  styleUrls: ['./dialog-add-payment.component.scss']
})
export class DialogAddPaymentComponent implements OnInit {

  public frmAddPayment: FormGroup;
  public user;
  public idContact

  constructor(
    private _formBuilder:     FormBuilder,
    public router:            Router,
    private _route:           ActivatedRoute,
    private _paymentServices: PaymentService,
    private _userService:     UserService,
    private _snackBarService: SnackbarService,
    public dialogRef:         MatDialogRef<DialogAddPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.validations();
   }

  ngOnInit(): void {
    console.log(this.data)
    this.idContact = this.data.contactId;
    this.user = this._userService.getUserLocal();
  }

  ok(){
    this.dialogRef.close(true);
  }
  cancel(){

    this.dialogRef.close(false);
  }

  addPayment(){
    console.log(this.data)
    if(this.frmAddPayment.invalid){ return;}
    const objPayment        = this.frmAddPayment.value;
    objPayment.idContact    = this.idContact;
    objPayment.typePayment  = 'General';

    this._paymentServices.addPayment(this.user.uid,objPayment );
    this.frmAddPayment.reset();
    this._snackBarService.customSnackbar('Pago agregado correctamente','ok', 5000);
    console.log('objPayment',objPayment);
    this.ok();
  }

  validations(){
    this.frmAddPayment = this._formBuilder.group({
      commentPayment:  [null, [Validators.maxLength(100)]],
      valuePayment:    [null, [Validators.required, Validators.pattern(/^[0-9]\d*$/)]]
    })
  }


  validateData(){
    console.log('data',this.data);
  }
}
