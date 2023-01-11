
import { AfterViewInit, Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig } from '@angular/material/legacy-dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DialogAddPaymentComponent } from 'src/app/modules/payment/components/dialog-add-payment/dialog-add-payment.component';
import { ContactService } from 'src/app/services/business/contact.service';
import { DebtService } from 'src/app/services/business/debt.service';
import { PaymentService } from 'src/app/services/business/payment.service';
import { SnackbarService } from 'src/app/services/shared/snackbar.service';
import { UserService } from 'src/app/services/shared/user.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, AfterViewInit {

  frmUpdateContact: FormGroup;
  idContact;
  contact;
  user;
  isChangePays            = false;
  isDisabledForm          = true;
  panelDebtState          = false;
  panelDetailcontactState = true;
  panelPaymentState       = false;
  isUpdateDebts           = false;
  totalDebt       = 0;
  totalPayment    = 0;
  totalCalculate  = 0;


  constructor(
    private _formBuilder      : FormBuilder,
    private _contactService   : ContactService,
    private _userService      : UserService,
    private _snackBarService  : SnackbarService,
    public router             : Router,
    private _route            : ActivatedRoute,
    private _debtService      : DebtService,
    public dialog             : MatDialog,
    private _paymentsService  : PaymentService

  ) {
    this.validations();
    this.user = this._userService.getUserLocal();
  }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.idContact = String(params['id']);

      this.getContactsByUserId(this.idContact);
      this.getTotalDebts();
      this.getTotalPayments();
      this.calculateTotalgeneral();

    });
  }
  ngAfterViewInit(): void {

  }

  getContactsByUserId(uid) {
    const contact = this._contactService.getContactbyIdContact(uid);

    contact.indicative = contact.indicative.replace('+', '');
    this.frmUpdateContact.controls['nickName'].setValue(contact.nickname);
    this.frmUpdateContact.controls['emailContact'].setValue(contact.email);
    this.frmUpdateContact.controls['numberPhone'].setValue(contact.phoneNumber);
    this.frmUpdateContact.controls['indicative'].setValue(contact.indicative);
  }


  validations() {
    this.frmUpdateContact = this._formBuilder.group({
      emailContact  : [null, [Validators.required]],
      nickName      : [null, [Validators.required]],
      numberPhone   : [null, [Validators.required, Validators.pattern("[0-9]{10}")]],
      indicative    : [null, [Validators.required, Validators.pattern("[0-9]{2}")]]
    })
  }

  async updateContact() {
    if (this.frmUpdateContact.invalid) { return; }

    const respond = await this._contactService.updateContactByIdContact(this.user.uid,
      this.frmUpdateContact.value,
      this.idContact);

    if (respond) {
      this.isDisabledForm = !this.isDisabledForm;
      this._snackBarService.customSnackbar('Contacto editado con exito', 'ok', 5000);
    }
  }

  getTotalDebts() {
    this.totalDebt = this._debtService.getTotalDebtsByidContact(this.user.uid, this.idContact);
  }

  async getTotalPayments() {
    this.totalPayment = await this._paymentsService.getTotalPaymentsByContactId(this.user.uid, this.idContact);
  }

  isEditContact() {
    this.isDisabledForm = !this.isDisabledForm;
  }
  cancel() {
    this.isDisabledForm = !this.isDisabledForm;
    this.getContactsByUserId(this.idContact);
  }

  openGeneralPayment(event) {
    const data = { contactId: this.idContact, totalCalculate: this.totalCalculate };
    const dialogComponent                  = new MatDialogConfig();
    dialogComponent.autoFocus              = true;
    dialogComponent.disableClose           = true;
    dialogComponent.data                   = data;
    dialogComponent.panelClass             = 'custom-modalbox';
    dialogComponent.enterAnimationDuration = '1000ms';
    dialogComponent.exitAnimationDuration  = '1000ms';

    const dialogRef = this.dialog.open(DialogAddPaymentComponent, dialogComponent,);
    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getTotalDebts();
        this.getTotalPayments();
        this.calculateTotalgeneral();
        this.isChangePays   = true;
      }
    });
    event.stopPropagation();
  }

  changeStatusPay(event:boolean){
    if(!event){
      setTimeout(() => {
        this.isChangePays = event;
      }, 2000);

    }else{

      setTimeout(() => {
        this.isUpdateDebts = !this.isUpdateDebts;
        this.isChangePays   = event;
      }, 100);

      setTimeout(() => {
        this.getTotalDebts();
        this.calculateTotalgeneral();
        this.getTotalPayments();
      }, 100);

    }
  }

  calculateTotalgeneral(){
    setTimeout(() => {
      this.totalCalculate = this.totalDebt - this.totalPayment;
    }, 200);
  }

}
