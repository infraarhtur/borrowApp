
import { AfterViewInit, Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DialogAddPaymentComponent } from 'src/app/modules/payment/components/dialog-add-payment/dialog-add-payment.component';
import { ContactService } from 'src/app/services/business/contact.service';
import { DebtService } from 'src/app/services/business/debt.service';
import { EmailService } from 'src/app/services/business/email.service';
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
  oPaymentGeneral;
  isChangePays            = false;
  isDisabledForm          = true;
  panelDebtState          = false;
  panelDetailcontactState = true;
  panelPaymentState       = false;
  isUpdateDebts           = false;
  totalDebt       = 0;
  totalPayment    = 0;
  totalCalculate  = 0;
  debtsAsociate   = [];

  constructor(
    private _formBuilder      : FormBuilder,
    private _contactService   : ContactService,
    private _userService      : UserService,
    private _snackBarService  : SnackbarService,
    public router             : Router,
    private _route            : ActivatedRoute,
    private _debtService      : DebtService,
    public dialog             : MatDialog,
    private _paymentsService  : PaymentService,
    private _emailService     : EmailService,

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

      if (result) {
        this.getTotalDebts();
        this.getTotalPayments();
        this.calculateTotalgeneral();
        const listDebts = this._debtService.getDebtsByIsPaid(this.user.uid, this.idContact, false);
        const isPayTotal = result.oPayment.valuePayment === this.totalCalculate && result.oPayment.typePayment !== "General" ? true : false;

        listDebts.forEach(item => {
          if (isPayTotal && result.oDebt !== undefined) {
            item.isPaid = true;
            item.sumPaid = item.typeDebt === 'interesFijo' ? item.totalValue : item.debtValue;

            this._debtService.updateDebtByUid(this.user.uid, item).then(r => {
              this.changeStatusPay(true);
            });
          } else {

            if (isPayTotal && result.oPayment.typePayment === 'General') {
              if(!item.isPaid){
                item.isPaid = true;
                item.sumPaid = item.totalValue;
                this._debtService.updateDebtByUid(this.user.uid, item).then(r => {
                  console.log('Actualizo Debt', r);
                  this.changeStatusPay(true);
                });
              }
              this._paymentsService.editPaymentGeneralDebtsId(this.user.uid,result.oPayment);

            } else if (result.oDebt === undefined && result.oPayment.typePayment === 'General') {

              this.oPaymentGeneral = result.oPayment;
              this._paymentsService.editPaymentGeneralDebtsId(this.user.uid,result.oPayment)

              result.oPayment.idsGeneral.forEach(element => {
                if (element.uid === item.uid && !isPayTotal) {
                  item.sumPaid = item.sumPaid + element.value;
                  if (!element.isPayTotal && item.sumPaid === item.totalValue) {
                    item.isPaid = true;
                  } else {
                    item.isPaid = element.isPayTotal;
                  }
                  this.debtsAsociate.push(item);
                  this._debtService.updateDebtByUid(this.user.uid, item).then(r => {
                    console.log('Actualizo Debt', r);
                    this.changeStatusPay(true);
                  });
                }
              });

            } else {
              this._debtService.updateDebtByUid(this.user.uid, item).then(r => {
                console.log('Actualizo Debt', r);
                this.changeStatusPay(true);
              });
            }
          }

        });
      }
    });
    event.stopPropagation();
  }

  changeStatusPay(event: boolean) {
    if (!event) {
      setTimeout(() => {
        this.isChangePays = event;
        if(this.debtsAsociate.length > 0){
          this._emailService.emailAddPayGeneral(this.user,this.debtsAsociate,this.idContact,this.oPaymentGeneral,this.totalCalculate);
          setTimeout(() => {
            this.debtsAsociate = [];
            this.debtsAsociate = [];
          },0)

        }
      }, 2000);

    } else {

      setTimeout(() => {
        this.isUpdateDebts = !this.isUpdateDebts;
        this.isChangePays = event;
      }, 100);

      setTimeout(() => {
        this.getTotalDebts();
        this.calculateTotalgeneral();
        this.getTotalPayments();
      }, 100);

    }
  }

  calculateTotalgeneral() {
    setTimeout(() => {
      this.totalCalculate = this.totalDebt - this.totalPayment;
    }, 200);
  }
  redirectToCreateDebt(event) {
    this.router.navigate(['debt/create'], { queryParams: { contact: this.idContact } });
    event.stopPropagation();
  }
}
