import { Injectable } from '@angular/core';
import { User } from '../../models/shared/user';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  doc,
  setDoc,
  deleteDoc, getDoc, updateDoc, getDocs
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CryptoJsService } from '../shared/crypto-js.service';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from '../shared/user.service';
import { SnackbarService } from '../shared/snackbar.service';
import { UtilitiesService } from '../shared/utilities.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(
    private _userService:     UserService,
    private _firestore:       Firestore,
    private router:           Router,
    private criptoService:    CryptoJsService,
    private _snackBarService: SnackbarService,
    private _utilities:       UtilitiesService
  ) {

  }

  async addPayment(userId, oPayment){
    const guid = uuidv4();
    oPayment.createDate = this._utilities.getTodayFormat();
    const paymentRef2 = doc(this._firestore, `/users/${userId}/payments/${guid}`);
    const paymentToCreate = {
      uid:            guid,
      valuePayment:   oPayment.valuePayment,
      commentPayment: oPayment.commentPayment,
      createDate:     oPayment.createDate,
      type:           oPayment.typePayment,
      contactId:      oPayment.idContact,
      debtId:         oPayment.debtId
    };
    const resp = await setDoc(paymentRef2, paymentToCreate);
    return guid;
  }

  async editPayment(userId, oPayment){
    const paymentRef = doc(this._firestore, `users/${userId}/payments/${oPayment.uid}`);

    const lastUpdateDate = this._utilities.getTodayFormat();
    const respUpdate = await updateDoc(paymentRef, {
      commentPayment :oPayment.commentPayment,
      lastDateUpdate :lastUpdateDate
    });
    if(respUpdate === undefined){
      const payments = await this.paymentsDecrypt(userId);
      payments.forEach(item => {
        if(item.uid === oPayment.uid){
          item.commentPayment = oPayment.commentPayment;
        }
      });
      this.paymentsEncript(JSON.stringify(payments));
      return true;
    }
  }

  async editPaymentGeneralDebtsId(userId, oPayment){
    const paymentRef = doc(this._firestore, `users/${userId}/payments/${oPayment.uid}`);
    const lastUpdateDate = this._utilities.getTodayFormat();
    const respUpdate = await updateDoc(paymentRef, {
      debtsAsociate  :oPayment.idsGeneral,
      lastDateUpdate :lastUpdateDate
    });
    if(respUpdate === undefined){
      const payments = await this.paymentsDecrypt(userId);
      payments.forEach(item => {
        if(item.uid === oPayment.uid){
          item.debtsAsociate = oPayment.idsGeneral;
        }
      });
      this.paymentsEncript(JSON.stringify(payments));
      return true;
    }
  }

  async getPaymentsByContactId(userId,contactId){
    let paymentList = [];
    const payments = await this.paymentsDecrypt(userId);
    payments.forEach(item => {
      if(item.contactId === contactId){
        item['dateOrder'] = this._utilities.convertStringToDate(item.createDate)
        paymentList.push(item);
      }
    });
    return paymentList.sort((x, y) => y.dateOrder - x.dateOrder);
  }



  async getPaymentsByIdUser(userId) {
    let payments = [];
    const querySnapshot = await getDocs(collection(this._firestore, `users/${userId}/payments`));
    querySnapshot.forEach((doc) => {
      payments.push(doc.data());
    });
    console.log('getPaymentsByIdUser',payments);
    return payments;
  }

  async verifyPaymentsByIdUserWithSession() {
    const user = this._userService.getUserLocal();

    if (localStorage.getItem('payments') === null) {
      const payments = await this.getPaymentsByIdUser(user.uid);
      this.paymentsEncript(JSON.stringify(payments));
    }
  }

  paymentsEncript(payments) {
    const paymentsEncrypt = this.criptoService.encryptUsingAES256(payments);
    localStorage.setItem('payments', paymentsEncrypt);
  }

  async paymentsDecrypt(userId) {
    const paymentsEncrypt = localStorage.getItem('payments');
    if(paymentsEncrypt !== null){
      const paymentsDecrypt = this.criptoService.decryptUsingAES256(paymentsEncrypt);

      return JSON.parse(paymentsDecrypt);
    }else{
      return await this.getPaymentsByIdUser(userId);
    }
  }


  async getTotalPaymentsByidUser(userId) {
    let totalDebt = 0;
    const payments = await this.paymentsDecrypt(userId);
    payments.forEach(item => {
      totalDebt += item.valuePayment;
    });
    return totalDebt;
  }
  async getTotalPaymentsByContactId(userId,contactId) {
    let totalDebt = 0;
    const payments = await this.paymentsDecrypt(userId);
    payments.forEach(item => {
      if(item.contactId === contactId){
        totalDebt += item.valuePayment;
      }
    });
    return totalDebt;
  }

  async deletePaymentById(userId:string,paymentById:string){
    const paymentRef = doc(this._firestore, `users/${userId}/payments/${paymentById}`);
    return  deleteDoc(paymentRef).then(result => {
      localStorage.removeItem('payments');
      this.verifyPaymentsByIdUserWithSession();
      return true;
    }).catch(error => {
      alert(error);
    })
  }

  async getPaymentById(userId:string,paymentById:string){
    const PaymentRef = doc(this._firestore, `users/${userId}/payments/${paymentById}`);
    return  await getDoc(PaymentRef);
  }

  async getPaymentsByIdDebt(userId, uidDebt){

  const listPayments = await this.paymentsDecrypt(userId);
  let listPaymentsFiltered = [];
  listPayments.forEach(element => {
    element['dateOrder'] = this._utilities.convertStringToDate(element.createDate)
    if(element.type === "Especific" && element.debtId === uidDebt){
      listPaymentsFiltered.push(element);
    }
    else if(element.type === "General"){
      element.debtsAsociate.forEach(itemDebtAssociated => {
        if(itemDebtAssociated.uid === uidDebt){
          listPaymentsFiltered.push(element);
        }
      });
    }
  });
  return listPaymentsFiltered.sort((x, y) => y.dateOrder - x.dateOrder);
  }

}
