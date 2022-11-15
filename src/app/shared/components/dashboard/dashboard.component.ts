import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/shared/auth.service';

import { AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { UserService } from 'src/app/services/shared/user.service';
import { Router } from '@angular/router';
import { CryptoJsService } from 'src/app/services/shared/crypto-js.service';

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

  constructor(
    public authService: AuthService,
    private _userService: UserService,
    public router: Router,

  ) {

  }

  ngOnInit(): void {
    this._userService.verifyTermns()


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



}
