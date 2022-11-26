import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/services/shared/auth.service';

import { AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { UserService } from 'src/app/services/shared/user.service';
import { Router } from '@angular/router';
import { CryptoJsService } from 'src/app/services/shared/crypto-js.service';
import { ContactService } from 'src/app/services/business/contact.service';
import { SnackbarService } from 'src/app/services/shared/snackbar.service';
import { DebtService } from 'src/app/services/business/debt.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit,AfterViewInit  {
  @Output() eventoSesion = new EventEmitter();
  options: AnimationOptions = {
    path: '../../../../assets/lottie/motorcycle3.json',
  };
  options2: AnimationOptions = {
    path: '../../../../assets/lottie/logout.json',
  };

  hideBorrowed = false;
  hideCollected  = false;
  user;
  totalDebt = 0;

  constructor(
    public authService: AuthService,
    private _userService: UserService,
    public router: Router,
    private contactService: ContactService,
    private _snackBarService: SnackbarService,
    private _debtService: DebtService

  ) {
    this.user = this._userService.getUserLocal();
  }

  ngOnInit(): void {
    this._userService.verifyTermns();
    this.getContacts();
    this.getDebts();

  }
  ngAfterViewInit(): void{

  }

  signOut() {
    localStorage.setItem('IsIdentity', 'false');
    this.eventoSesion.emit(true);
    this.authService.SignOut();
  }

  animationCreated(animationItem: AnimationItem): void {
    animationItem.playSpeed = 1.0,
      animationItem
  }
  redirectToDebt(){
    this.router.navigate(['debt/create']);
  }

  async getContacts() {
    if (localStorage.getItem('contacts') === null) {
      const contacts = await this.contactService.getContactsByUserId(this.user.uid);
      this.contactService.contactsEncript(JSON.stringify(contacts));
    }
  }

  async getDebts(){
    if (localStorage.getItem('debts') === null) {
      const debts = await this._debtService.getDebtsByIdUser(this.user.uid);
      this._debtService.debtsEncript(JSON.stringify(debts));
    }
  }

  isHideBorrowed(){
  this.totalDebt = this._debtService.getTotalDebtsByidUser(this.user.uid);
   this.hideBorrowed = !this.hideBorrowed;
  }
}
