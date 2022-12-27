import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PaymentService } from 'src/app/services/business/payment.service';
import { SnackbarService } from 'src/app/services/shared/snackbar.service';
import { UserService } from 'src/app/services/shared/user.service';

@Component({
  selector: 'app-list-payments-by-contact',
  templateUrl: './list-payments-by-contact.component.html',
  styleUrls: ['./list-payments-by-contact.component.scss']
})
export class ListPaymentsByContactComponent implements OnInit {

  @Input() idContact: string;
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

  ngOnInit(): void {
    this.getPaymentsByContactId();
  }

  getPaymentsByContactId(){
   this.payments = this._paymentService.getPaymentsByContactId(this.user,this.idContact);
  }
}
