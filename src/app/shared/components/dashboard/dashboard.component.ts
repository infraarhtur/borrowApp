import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/shared/auth.service';

import { AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { UserService } from 'src/app/services/shared/user.service';
import { Router } from '@angular/router';
import { CryptoJsService } from 'src/app/services/shared/crypto-js.service';
import { ContactService } from 'src/app/services/business/contact.service';
import { SnackbarService } from 'src/app/services/shared/snackbar.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @Output() eventoSesion = new EventEmitter();
  options: AnimationOptions = {
    path: '../../../../assets/lottie/motorcycle3.json',
  };
  options2: AnimationOptions = {
    path: '../../../../assets/lottie/logout.json',
  };

  hideBorrowed = false;
  hideCollected  = false;

  constructor(
    public authService: AuthService,
    private _userService: UserService,
    public router: Router,
    private contactService: ContactService,
    private _snackBarService: SnackbarService,

  ) {

  }

  ngOnInit(): void {
    this._userService.verifyTermns();
    this.getContacts();
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
    const user = this._userService.getUserLocal();
    if (localStorage.getItem('contacts') === null) {
      const contacts = await this.contactService.getContactsByUserId(user.uid);
      this.contactService.contactsEncript(JSON.stringify(contacts));
    }
  }

}
