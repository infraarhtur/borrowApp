
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ContactService } from 'src/app/services/business/contact.service';
import { SnackbarService } from 'src/app/services/shared/snackbar.service';
import { UserService } from 'src/app/services/shared/user.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  public frmUpdateContact: FormGroup;
  idContact;
  contact;
  isDisabledForm = true;
  constructor(
    private _formBuilder: FormBuilder,
    private _contactService: ContactService,
    private _userService: UserService,
    private _snackBarService: SnackbarService,
    public router: Router,
    private _route: ActivatedRoute,
  ) {
    this.validations();
  }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.idContact = String(params['id']);

      this.getContactsByUserId(this.idContact);

    })

  }

getContactsByUserId(uid){
    const contact =  this._contactService.getContactbyIdContact(uid);

    contact.indicative = contact.indicative.replace('+','');
    this.frmUpdateContact.controls['nickName'].setValue(contact.nickname);
    this.frmUpdateContact.controls['emailContact'].setValue(contact.email);
    this.frmUpdateContact.controls['numberPhone'].setValue(contact.phoneNumber);
    this.frmUpdateContact.controls['indicative'].setValue(contact.indicative);
  }


  validations() {
    this.frmUpdateContact = this._formBuilder.group({
      emailContact: [null, [Validators.required]],
      nickName: [null, [Validators.required]],
      numberPhone: [null, [Validators.required, Validators.pattern("[0-9]{10}")]],
      indicative: [null, [Validators.required, Validators.pattern("[0-9]{2}")]]
    })
  }

  updateContact() {
    if (this.frmUpdateContact.invalid) { return; }
  }

  isEditContact(){
    this.isDisabledForm = !this.isDisabledForm;
  }
  cancel(){
    this.isDisabledForm = !this.isDisabledForm;
    this.getContactsByUserId(this.idContact);
  }
}
