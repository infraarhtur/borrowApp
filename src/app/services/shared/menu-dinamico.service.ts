import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {NavItem} from 'src/app/models/shared/navItem';

@Injectable({
  providedIn: 'root'
})
export class MenuDinamicoService {
  public urlBase = '';
  constructor(private http: HttpClient) {
    this.urlBase = environment.urlBaseServicio;
  }

  obtenerMenuItems(){
    const url = `${this.urlBase}/menuDinamico`;
    return this.http.get<NavItem[]>(url);

  }


}
