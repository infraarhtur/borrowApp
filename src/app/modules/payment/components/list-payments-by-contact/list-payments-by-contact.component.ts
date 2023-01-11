import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig } from '@angular/material/legacy-dialog';
import { DebtService } from 'src/app/services/business/debt.service';
import { PaymentService } from 'src/app/services/business/payment.service';
import { SnackbarService } from 'src/app/services/shared/snackbar.service';
import { UserService } from 'src/app/services/shared/user.service';
import { DialogDynamicTextComponent } from 'src/app/shared/components/dialog-dynamic-text/dialog-dynamic-text.component';
import { DialogEditPaymentComponent } from '../dialog-edit-payment/dialog-edit-payment.component';

@Component({
  selector: 'app-list-payments-by-contact',
  templateUrl: './list-payments-by-contact.component.html',
  styleUrls: ['./list-payments-by-contact.component.scss']
})
export class ListPaymentsByContactComponent implements OnInit, OnChanges {

  @Input() idContact: string;
  @Input() isChangePays: boolean;
  @Output() isPaychange = new EventEmitter<boolean>();

  payments = [];
  user;

  constructor(
    private _userService:     UserService,
    private _snackBarService: SnackbarService,
    private _paymentService:  PaymentService,
    public dialog:            MatDialog,
    private _debtService:     DebtService,

  ) {
    this.user = this._userService.getUserLocal();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['isChangePays'].currentValue === true){
      this.getPaymentsByContactId();
      this.isPaychange.emit(false);
    }
  }

  ngOnInit(): void {
    this.getPaymentsByContactId();
  }


  async getPaymentsByContactId(){
   this.payments = await this._paymentService.getPaymentsByContactId(this.user.uid,this.idContact);
  }

  async deletePaymentById(event, payment){
    const msj = '¿Está seguro de eliminar este pago?';
    this.confirmModalDeletePaymentOpen(msj,payment);
    event.stopPropagation();
  }


  async confirmModalDeletePaymentOpen(message, payment) {
    const dialogComponent        = new MatDialogConfig();
    dialogComponent.autoFocus    = true;
    dialogComponent.disableClose = true;
    dialogComponent.data = {
      msj       : message ,
      btnCancel : 'Cancelar' ,
      btnOk     : 'Eliminar',
      title     : 'Confirmación'
      };
    dialogComponent.panelClass             = 'custom-modalbox';
    dialogComponent.enterAnimationDuration = '1000ms';
    dialogComponent.exitAnimationDuration  = '1000ms'
    const dialogRef = this.dialog.open(DialogDynamicTextComponent, dialogComponent);
    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        const result =  this._paymentService.deletePaymentById(this.user.uid, payment.uid)
        .then(_=> {
          this._snackBarService.customSnackbar('Pago eliminado', 'ok', 5000);
          this.getPaymentsByContactId();

         const oDebt = this._debtService.getDebtById(this.user.uid,payment.debtId);
         oDebt.sumPaid -= payment.valuePayment;
         oDebt.isPaid   = false;
         this._debtService.updateDebtByUid(this.user.uid,oDebt).then(r => {
          this.isPaychange.emit(true);
         });
        });
      }else{
        return
      }
    });
  }


  UpdateCommentPayment(event,item) {

    const user = {
      contactId :this.idContact,
      payment :item

    };
    const dialogComponent                  = new MatDialogConfig();
    dialogComponent.autoFocus              = true;
    dialogComponent.disableClose           = true;
    dialogComponent.data                   = user;
    dialogComponent.panelClass             = 'custom-modalbox';
    dialogComponent.enterAnimationDuration = '1000ms';
    dialogComponent.exitAnimationDuration  = '1000ms'

    const dialogRef = this.dialog.open(DialogEditPaymentComponent, dialogComponent,);
    dialogRef.disableClose = true;
    event.stopPropagation();
  }
  test(){
    this.isPaychange.emit(true);
  }

}
