import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'borrowApp';
  public general: boolean;
  public login = true;

  constructor(
    private router: Router,
    // public authFireService: AuthFireService
  ) {
    this.general = false;

    // this.authFireService.initAuthListener();
    this.eventoSesion();
  }

  profileForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
  });

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.profileForm.value);
  }
  eventoSesion() {
    let identity = localStorage.getItem('IsIdentity');
    if (identity == 'false') {
      this.login = true;
      this.general = false;
    } else if (identity == 'true') {
      this.general = true;
      this.login = false;
    }
  }


}
