import { Component, OnInit,Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from 'src/app/services/business/payment.service';
import { SnackbarService } from 'src/app/services/shared/snackbar.service';
import { UserService } from 'src/app/services/shared/user.service';

@Component({
  selector: 'app-dialog-edit-payment',
  templateUrl: './dialog-edit-payment.component.html',
  styleUrls: ['./dialog-edit-payment.component.scss']
})
export class DialogEditPaymentComponent implements OnInit {

  @ViewChild('comment') commentElement: ElementRef;
  public frmEditPayment: FormGroup;
  public user;
  public idContact;
  public debtId = '';

  constructor(
    private _formBuilder:     FormBuilder,
    public router:            Router,
    private _route:           ActivatedRoute,
    private _paymentServices: PaymentService,
    private _userService:     UserService,
    private _snackBarService: SnackbarService,
    public dialogRef:         MatDialogRef<DialogEditPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

   }

  ngOnInit(): void {

    this.validations(this.data.payment.valuePayment,this.data.payment.commentPayment);
    this.user = this._userService.getUserLocal();

    setTimeout(() => {
      this.commentElement.nativeElement.focus();
    }, 2000);


  }

  ok(){
    this._paymentServices.verifyPaymentsByIdUserWithSession()
    this.dialogRef.close(true);
  }

  cancel(){
    this.dialogRef.close(false);
  }

  validations(value = null, comment = null){
    this.frmEditPayment = this._formBuilder.group({
      commentPayment:  [comment, [Validators.maxLength(100)]],
      valuePayment:    [value, [Validators.required, Validators.pattern(/^[0-9]\d*$/)]]
    })

  }

  validateData(){
    console.log('data',this.data);
  }
  async editPayment(){
    if(this.frmEditPayment.invalid){ return;}

    const objPayment   = this.frmEditPayment.value;
    this.data.payment.commentPayment =objPayment.commentPayment;
    const result = await this._paymentServices.editPayment(this.user.uid, this.data.payment);

    if(result){
      this._snackBarService.customSnackbar('Comentario actualizado correctamente','ok', 5000);
      this.ok()
    }


  }


}
