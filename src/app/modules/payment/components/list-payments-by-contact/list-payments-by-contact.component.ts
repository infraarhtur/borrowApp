import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PaymentService } from 'src/app/services/business/payment.service';
import { SnackbarService } from 'src/app/services/shared/snackbar.service';
import { UserService } from 'src/app/services/shared/user.service';
import { DialogDynamicTextComponent } from 'src/app/shared/components/dialog-dynamic-text/dialog-dynamic-text.component';

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

  async deletePaymentById(event, paymentId: string){
    const msj = '¿Está seguro de eliminar este pago?';
    this.confirmModalDeletePaymentOpen(msj,paymentId);
    event.stopPropagation();
  }


  async confirmModalDeletePaymentOpen(message, paymentId) {
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
        const result =  this._paymentService.deletePaymentById(this.user.uid, paymentId)
        .then(_=> {
          this._snackBarService.customSnackbar('Pago eliminado', 'ok', 5000);
          this.getPaymentsByContactId();
          this.isPaychange.emit(true);
        });
      }else{
        return
      }
    });
  }
}
