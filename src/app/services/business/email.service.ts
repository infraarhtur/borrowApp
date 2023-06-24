import { Injectable } from '@angular/core';
import { HttpClient, HttpParams,HttpHeaders} from '@angular/common/http';

import { UserService } from '../shared/user.service';
import { UtilitiesService } from '../shared/utilities.service';
import { ContactService } from './contact.service';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(
    private http: HttpClient,
    private _contactServices :ContactService
    ) {

    }


  emailCreateDebt(userInfo,contactInfo, debt){

    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    const body = {
      user:userInfo,
      contact:contactInfo,
      debt:debt
    };

    let url = `https://1o7mjxqcdd.execute-api.us-east-1.amazonaws.com/dev/`;
    url = url + 'createdebts';

    this.http.post(url,body).subscribe(resp => {
      console.log(resp);
    })

  }

emailAddPay(user,objInfo){
  const url = `https://j8ymbipx0l.execute-api.us-east-1.amazonaws.com/prod/emailcreatedebt`;
  const infoContact = this._contactServices.getContactbyIdContact(objInfo['oPayment']['idContact'])
  const body ={
    debt: objInfo['oDebt'],
    payment: objInfo['oPayment'],
    user: {displayName:user['displayName'] },
    contact:{ email:infoContact['email']}
  };
  console.log('body');
  console.log(JSON.stringify(body));
  // this.http.post(url,body).subscribe(result => {
  //   console.log('Envio correo de pago especifico');
  //   console.log(result);
  // })
}

emailAddPayGeneral(user,listDebts,idContact, oPayment){
  const url = `https://j8ymbipx0l.execute-api.us-east-1.amazonaws.com/prod/emailcreatedebt`;
  const infoContact = this._contactServices.getContactbyIdContact(idContact);
  const body ={
    debts: listDebts,
    user: {displayName:user['displayName'] },
    contact:{ email:infoContact['email']},
    payment:oPayment
  }

  console.log(JSON.stringify(body))
  // this.http.post(url,body).subscribe(result => {
  //   console.log('Envio correo de pago general');
  //   console.log(result);
  // })
}

}
