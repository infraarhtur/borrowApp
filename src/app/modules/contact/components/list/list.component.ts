import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ContactService } from 'src/app/services/business/contact.service';
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
  ) {

  }

  ngOnInit(): void {


    this.contacts = [{ "uid": "7e6f3637-181f-443f-aabe-674614659d1a", "phoneNumber": "3208965792", "nickname": "contacto 1", "indicative": "+57", "email": "infraarhtur@test.com" },
    { "uid": "7e6f3637-181f-443f-aabe-674614659d1a", "phoneNumber": "3208965783", "nickname": "Luisa bb", "indicative": "+57", "email": "infraarhtur@test.com" }]
  }
  async getContacts() {
    const user = this.userService.getUserLocal();
    this.contacts = await this.contactService.getContactsByUserId(user.uid);
  }

}
