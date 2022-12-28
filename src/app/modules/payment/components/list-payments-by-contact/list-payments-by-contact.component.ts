import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PaymentService } from 'src/app/services/business/payment.service';
import { SnackbarService } from 'src/app/services/shared/snackbar.service';
import { UserService } from 'src/app/services/shared/user.service';

@Component({
  selector: 'app-list-payments-by-contact',
  templateUrl: './list-payments-by-contact.component.html',
  styleUrls: ['./list-payments-by-contact.component.scss']
})
export class ListPaymentsByContactComponent implements OnInit, OnChanges {

  @Input() idContact: string;
  @Input() isChangePays: boolean;
  @Output() isPaychange = new EventEmitter<boolean>();

  payments = [];
  user;

  constructor(
    private _userService:     UserService,
    private _snackBarService: SnackbarService,
    private _paymentService:  PaymentService,
    public dialog:            MatDialog,
  ) {
    this.user = this._userService.getUserLocal();
    console.log('user',this.user )
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['isChangePays'].currentValue === true){
      this.getPaymentsByContactId();
      this.isPaychange.emit(false);
    }
  }

  ngOnInit(): void {
    this.getPaymentsByContactId();
  }


  async getPaymentsByContactId(){
   this.payments = await this._paymentService.getPaymentsByContactId(this.user.uid,this.idContact);
  }

  async deletePaymentById(event, paymentId: string) {
    debugger
    console.log('paymentId eyyy', paymentId)
    // const result = await this._paymentService.deletePaymentById(this.user.uid, paymentId);
    // console.log('paymentId', paymentId)
    // if (result) {
      // let index = 0;
      // this.payments.forEach(item => {
      //   if (item.uid === paymentId) {
      //     this.payments.slice(index, 1)
      //   }
      //   index++;
      // })

      // console.log('holaa', this.payments)
    // }
    event.stopPropagation();
  }
}
