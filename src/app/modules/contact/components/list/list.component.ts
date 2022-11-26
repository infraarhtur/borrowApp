import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ContactService } from 'src/app/services/business/contact.service';
import { DebtService } from 'src/app/services/business/debt.service';
import { SnackbarService } from 'src/app/services/shared/snackbar.service';
import { UserService } from 'src/app/services/shared/user.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  contacts = [];
  constructor(
    private formBuilder: FormBuilder,
    private contactService: ContactService,
    private userService: UserService,
    private _snackBarService: SnackbarService,
    public router: Router,
    public _debtService: DebtService
  ) {

  }

  ngOnInit(): void {

    this.getContacts();
  }
  async getContacts() {
    const user = this.userService.getUserLocal();
    if (localStorage.getItem('contacts') === null) {
      this.contacts = await this.contactService.getContactsByUserId(user.uid);
      this.contactService.contactsEncript(JSON.stringify(this.contacts));
    } else {
      this.contacts = this.contactService.contactsDecrypt();
      debugger;
      this.contacts.forEach(item => {
        debugger;
        item.debtTotalValue = this._debtService.getTotalDebtsByidContact(user.uid,item.uid)
      })
console.log('this.contacts',this.contacts)
    }
  }


}
