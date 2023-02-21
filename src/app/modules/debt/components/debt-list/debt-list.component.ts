import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogAddPaymentComponent } from 'src/app/modules/payment/components/dialog-add-payment/dialog-add-payment.component';
import { DialogListPaymentComponent } from 'src/app/modules/payment/components/dialog-list-payment/dialog-list-payment.component';
import { ContactService } from 'src/app/services/business/contact.service';
import { DebtService } from 'src/app/services/business/debt.service';
import { PaymentService } from 'src/app/services/business/payment.service';
import { SnackbarService } from 'src/app/services/shared/snackbar.service';
import { UserService } from 'src/app/services/shared/user.service';

@Component({
  selector: 'app-debt-list',
  templateUrl: './debt-list.component.html',
  styleUrls: ['./debt-list.component.scss']
})
export class DebtListComponent implements OnInit, OnChanges {

  @Input()  idContact:     string;
  @Input()  isUpdateDebts: boolean;
  @Output() isPaychange = new EventEmitter<boolean>();
  dialogPayment     : DialogAddPaymentComponent;
  dialogListPayment : DialogListPaymentComponent;

  debts = [];
  user;

  constructor(
    private _formBuilder:     FormBuilder,
    private _contactService:  ContactService,
    private _userService:     UserService,
    private _snackBarService: SnackbarService,
    private _router:          Router,
    private _debtService:     DebtService,
    public dialog:            MatDialog,
    public _paymentService:   PaymentService
  ) {
    this.user = this._userService.getUserLocal();
  }

  ngOnInit(): void {
    this.getDebtsByIdContact();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.getDebtsByIdContact();
  }

  getDebtsByIdContact() {
    this.debts = this._debtService.getDebtsByIdContact(this.user.uid, this.idContact);
  }


async openPayment(event,debt) {
    const generalData = {
      contactId:this.idContact,
      debtId   :debt.uid,
      debt     :debt
    };
    const dialogComponent                  = new MatDialogConfig();
    dialogComponent.autoFocus              = true;
    dialogComponent.disableClose           = true;
    dialogComponent.data                   = generalData;
    dialogComponent.panelClass             = 'custom-modalbox';
    dialogComponent.enterAnimationDuration = '1000ms';
    dialogComponent.exitAnimationDuration  = '1000ms'

    const dialogRef = this.dialog.open(DialogAddPaymentComponent, dialogComponent,);
    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe(result => {
      if(result !== false){
        result.oDebt.sumPaid += result.oPayment.valuePayment;
        result.oDebt.isPaid   = result.oPayment.isPaid;
         this._debtService.updateDebtByUid(this.user.uid,result.oDebt).then(r => this.isPaychange.emit(true));
      }
    });
    event.stopPropagation();
  }

  async viewAssociatedPayments(event, debt){
    const data = {user:this.user ,debt};
    const dialogComponent                  = new MatDialogConfig();
    dialogComponent.autoFocus              = true;
    dialogComponent.disableClose           = true;
    dialogComponent.data                   = data;
    dialogComponent.panelClass             = 'custom-modalbox';
    dialogComponent.enterAnimationDuration = '1000ms';
    dialogComponent.exitAnimationDuration  = '1000ms';
    dialogComponent.width                 = '100%'
    const dialogRef = this.dialog.open(DialogListPaymentComponent, dialogComponent,);
    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe(result => {
    console.log('consulto pagos asociados');
    });
    event.stopPropagation();
  }
}
