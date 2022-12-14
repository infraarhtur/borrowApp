
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ContactService } from 'src/app/services/business/contact.service';
import { DebtService } from 'src/app/services/business/debt.service';
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
  user;
  isDisabledForm = true;
  panelDebtState = false;
  panelDetailcontactState = true;
  totalDebt = 0;
  constructor(
    private _formBuilder:     FormBuilder,
    private _contactService:  ContactService,
    private _userService:     UserService,
    private _snackBarService: SnackbarService,
    public router:            Router,
    private _route:           ActivatedRoute,
    private _debtService:     DebtService
  ) {
    this.validations();
    this.user = this._userService.getUserLocal();
  }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.idContact = String(params['id']);

      this.getContactsByUserId(this.idContact);
      this.getTotalDebts();

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

 async updateContact() {
    if (this.frmUpdateContact.invalid) { return; }

   const respond = await this._contactService.updateContactByIdContact(this.user.uid,
      this.frmUpdateContact.value,
       this.idContact);

    if(respond){
      this.isDisabledForm = !this.isDisabledForm;
      this._snackBarService.customSnackbar('Contacto editado con exito','ok', 5000);
    }

  }

  getTotalDebts(){
   this.totalDebt = this._debtService.getTotalDebtsByidContact(this.user.uid,this.idContact);
  }

  isEditContact(){
    this.isDisabledForm = !this.isDisabledForm;
  }
  cancel(){
    this.isDisabledForm = !this.isDisabledForm;
    this.getContactsByUserId(this.idContact);
  }

  openGeneralPyment(event){
    console.log('eyyy');
    event.stopPropagation();



  }
}
