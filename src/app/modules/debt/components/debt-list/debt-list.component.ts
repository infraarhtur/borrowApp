import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogAddPaymentComponent } from 'src/app/modules/payment/components/dialog-add-payment/dialog-add-payment.component';
import { ContactService } from 'src/app/services/business/contact.service';
import { DebtService } from 'src/app/services/business/debt.service';
import { SnackbarService } from 'src/app/services/shared/snackbar.service';
import { UserService } from 'src/app/services/shared/user.service';

@Component({
  selector: 'app-debt-list',
  templateUrl: './debt-list.component.html',
  styleUrls: ['./debt-list.component.scss']
})
export class DebtListComponent implements OnInit, OnChanges {

  @Input() idContact: string;
  dialogPyment : DialogAddPaymentComponent;

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
  detailDebtById(id) {

  }

  openPyment(event,debtUid) {

    const user = {
      contactId:this.idContact,
      debtId   :debtUid

    };
    const dialogComponent                  = new MatDialogConfig();
    dialogComponent.autoFocus              = true;
    dialogComponent.disableClose           = true;
    dialogComponent.data                   = user;
    dialogComponent.panelClass             = 'custom-modalbox';
    dialogComponent.enterAnimationDuration = '1000ms';
    dialogComponent.exitAnimationDuration  = '1000ms'

    const dialogRef = this.dialog.open(DialogAddPaymentComponent, dialogComponent,);
    dialogRef.disableClose = true;
    event.stopPropagation();



  }

}
