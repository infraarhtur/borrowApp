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
   this.payments = await this._paymentService.getPaymentsByContactId(this.user.id,this.idContact);
  }
}
