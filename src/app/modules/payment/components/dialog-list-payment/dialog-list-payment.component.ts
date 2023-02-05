import { Component, OnInit,Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PaymentService } from 'src/app/services/business/payment.service';

@Component({
  selector: 'app-dialog-list-payment',
  templateUrl: './dialog-list-payment.component.html',
  styleUrls: ['./dialog-list-payment.component.scss']
})
export class DialogListPaymentComponent  implements OnInit{
  test
  debtId
  payments
  constructor(
    public _paymentService :PaymentService,
    public dialogRef       :MatDialogRef<DialogListPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){

  }

  async ngOnInit() {
    this.payments = await this._paymentService.getPaymentsByIdDebt(
                                        this.data.user.uid,
                                        this.data.debt.uid);


  }
  cancel(){
    this.dialogRef.close(false);
  }
  ok(){

    this.dialogRef.close(true);
  }
}
