import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";

import { UserService } from '../shared/user.service';
import { UtilitiesService } from '../shared/utilities.service';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(
    private http: HttpClient
    ) {

    }


  emailCreateDebt(userInfo,contactInfo, debt){
    let userName =userInfo.displayName;
    let contactEmail = contactInfo.email;
    let concept = debt.concept;
    let debtValue = debt.debtTotalValue;
    let debtValueInit = debt.debtValue;
    let typeDebt = debt.typeDebt;
    contactEmail = 'infraarhtur@outlook.com';

    let queryParams = new HttpParams();
    queryParams = queryParams.append("name",userName);
    queryParams = queryParams.append("concept",concept);
    queryParams = queryParams.append("typeDebt",typeDebt);
    queryParams = queryParams.append("to",contactEmail);
    queryParams = queryParams.append("debValue",debtValue);
    queryParams = queryParams.append("payDate",debt.payDate);
    if(typeDebt !== 'sinIntereses'){
      queryParams = queryParams.append("fixedInterest",debt.fixedInterest);
      queryParams = queryParams.append("debtValueInit",debtValueInit);
    }

    let url = `https://168x8dm5hi.execute-api.us-east-1.amazonaws.com/prod/hello`;
    this.http.get(url,{params:queryParams}).subscribe(data => {
      console.log('Mi primer correo');
        console.log(data);
    });
  }
}
