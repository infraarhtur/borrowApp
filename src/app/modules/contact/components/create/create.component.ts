import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ContactService } from 'src/app/services/business/contact.service';
import { SnackbarService } from 'src/app/services/shared/snackbar.service';
import { UserService } from 'src/app/services/shared/user.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {


  public frmCreateContact: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private contactService: ContactService,
    private userService: UserService,
    private _snackBarService: SnackbarService,
    public router: Router,
  ) {

    this.validations();
  }

  ngOnInit(): void {
  }


  validations() {

    this.frmCreateContact = this.formBuilder.group({
      emailContact: [null, [Validators.required]],
      nickName:     [null, [Validators.required]],
      numberPhone:  [null, [Validators.required, Validators.pattern("[0-9]{10}")]],
      indicative:   [null, [Validators.required, Validators.pattern("[0-9]{2}")]]
    })
  }
  async createContact() {
    if (this.frmCreateContact.invalid) { return; }
    const user = this.userService.getUserLocal();
    const resp = await this.contactService.addContact(user.uid, this.frmCreateContact.value);

    if (resp === undefined) {
      this._snackBarService.customSnackbar('contacto creado con exito', 'ok', 5000);
      localStorage.removeItem('contacts');
      this.router.navigate(['contact/list']);
    }


  }

}
