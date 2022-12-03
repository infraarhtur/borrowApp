import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ContactService } from 'src/app/services/business/contact.service';
import { DebtService } from 'src/app/services/business/debt.service';
import { SnackbarService } from 'src/app/services/shared/snackbar.service';
import { UserService } from 'src/app/services/shared/user.service';

@Component({
  selector: 'app-debt-list',
  templateUrl: './debt-list.component.html',
  styleUrls: ['./debt-list.component.scss']
})
export class DebtListComponent implements OnInit,OnChanges  {

 @Input() idContact:string;
  // idContact1 = 'dc9f3346-6be7-4fb5-99b3-05afa4030b54';
  debts = [];

  constructor(
    private _formBuilder: FormBuilder,
    private _contactService: ContactService,
    private _userService: UserService,
    private _snackBarService: SnackbarService,
    private _router: Router,
    private _debtService: DebtService
  ) {
    console.log('entro que esta pasando aqui')
   }

  ngOnInit(): void {
    this.getDebtsByIdContact();
  }
  ngOnChanges(changes: SimpleChanges): void{
    console.log(changes);
    debugger;
    this.getDebtsByIdContact();
  }

  getDebtsByIdContact(){
  const user = this._userService.getUserLocal();
  this.debts = this._debtService.getDebtsByIdContact(user.uid,this.idContact);
  }

}
