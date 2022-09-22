import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/shared/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @Output() eventoSesion = new EventEmitter();
  constructor(public authService: AuthService) {

   }

  ngOnInit(): void {
  }

  signOut(){
    localStorage.setItem('IsIdentity', 'false');
    this.eventoSesion.emit(true);

    this.authService.SignOut()

  }
}
