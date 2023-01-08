import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ContactService } from 'src/app/services/business/contact.service';
import { DebtService } from 'src/app/services/business/debt.service';
import { SnackbarService } from 'src/app/services/shared/snackbar.service';
import { UserService } from 'src/app/services/shared/user.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogAddPaymentComponent } from 'src/app/modules/payment/components/dialog-add-payment/dialog-add-payment.component';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  contacts = [];
  dialogPayment : DialogAddPaymentComponent;
  user;

  constructor(
    private formBuilder       :FormBuilder,
    private contactService    :ContactService,
    private userService       :UserService,
    private _snackBarService  :SnackbarService,
    public router             :Router,
    public _debtService       :DebtService,
    public dialog             :MatDialog,
  ) {
    this.user = this.userService.getUserLocal();
  }

  ngOnInit(): void {
    this._debtService.verifyDebtsByIdUserWithSession(this.user.uid).then(_=> {
      this.getContacts();
    });
  }
  async getContacts() {
    if (localStorage.getItem('contacts') === null) {
      this.contacts = await this.contactService.getContactsByUserId(this.user.uid);
      this.contactService.contactsEncript(JSON.stringify(this.contacts));
    } else {
      this.contacts = this.contactService.contactsDecrypt();
      this.contacts.forEach(item => {
        item.debtTotalValue = this._debtService.getTotalDebtsByidContact(this.user.uid,item.uid)
      })
    }
  }

  detailContact(idUser){

    setTimeout(() => {
      this.router.navigate(['/contact/detail/',idUser] );
    },500);
  }

  PaymentAddlModalOpen(event, contactId){

    const user = { contactId:contactId }
    const dialogComponent = new MatDialogConfig();
    dialogComponent.autoFocus = true;
    dialogComponent.disableClose = true;
    dialogComponent.data = user;
    dialogComponent.panelClass = 'custom-modalbox';
    dialogComponent.enterAnimationDuration = '1000ms';
    dialogComponent.exitAnimationDuration = '1000ms'

    const dialogRef = this.dialog.open(DialogAddPaymentComponent, dialogComponent,);
    dialogRef.disableClose = true;
    event.stopPropagation();
  }

}
