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
import { UtilitiesService } from '../shared/utilities.service';


@Injectable({
  providedIn: 'root'
})
export class DebtService {

  constructor(
    private _userService  : UserService,
    private _firestore    : Firestore,
    private router        : Router,
    private criptoService : CryptoJsService,
    private _utilities    : UtilitiesService
  ) {

  }

  addDebt(userId, debt) {
    const guid = uuidv4();
    const contactRef2 = doc(this._firestore, `/users/${userId}/debts/${guid}`);
    debt = this.calculateValues(debt)

    const contactTocreate = {
      uid:            guid,
      concept:        debt.concept,
      contacts:       debt.contacts,
      debtValue:      debt.debtValue,
      isFixedFees:    debt.isFixedFees,
      isGroupDebt:    debt.isGroupDebt,
      payDate:        debt.payDate,
      typeDebt:       debt.typeDebt,
      fixedInterest:  debt.fixedInterest,
      totalValue :    debt.debtTotalValue,
      createDate:     debt.createDate,
      numberFees:     debt.numberFees,
      paymentDay:     debt.paymentDay,
      paymentCycle:   debt.paymentCycle,
      isPaid:         false,
      sumPaid:        0
    }

    return setDoc(contactRef2, contactTocreate);

  }

  async getDebtsByIdUser(userId) {
    let debts = [];
    const querySnapshot = await getDocs(collection(this._firestore, `users/${userId}/debts`));
    querySnapshot.forEach((doc) => {
      debts.push(doc.data());
    });
    return debts;
  }

  async verifyDebtsByIdUserWithSession(userId) {
    if (localStorage.getItem('debts') === null) {
      const debts = await this.getDebtsByIdUser(userId);
      this.debtsEncript(JSON.stringify(debts));
    }
  }
  debtsEncript(debts) {
    const debtsEncrypt = this.criptoService.encryptUsingAES256(debts);
    localStorage.setItem('debts', debtsEncrypt);
  }

  debtsDecrypt(userId) {
    const debtsEncrypt = localStorage.getItem('debts');
    if(debtsEncrypt !== null){
      const debtsDecrypt = this.criptoService.decryptUsingAES256(debtsEncrypt);
      return JSON.parse(debtsDecrypt)
    }else{
      return this.getDebtsByIdUser(userId);
    }
  }

  getDebtById(userId,DebtUid){
    const debtsSelected = [];
    const debts = this.debtsDecrypt(userId);
    debts.forEach(item => {
      if(item.uid === DebtUid){
        debtsSelected.push(item) ;
      }
    });
    return debtsSelected[0];
  }
  getTotalDebtsByidUser(userId) {
    let totalDebt = 0;
    this.verifyDebtsByIdUserWithSession(userId);
    const debts = this.debtsDecrypt(userId);
    debts.forEach(item => {
      totalDebt += item.totalValue;
    });
    return totalDebt;
  }


  getTotalDebtsByidContact(userId, contactId) {
    let totalDebt = 0;
    this.verifyDebtsByIdUserWithSession(userId);
    const debts = this.debtsDecrypt(userId);
    debts.forEach(item => {
      if( item.contacts === contactId){
        totalDebt += item.totalValue;
      }
    });
    return totalDebt;
  }

  getDebtsByIdContact(userId, contactId){
    let debtsSelects =[];
    this.verifyDebtsByIdUserWithSession(userId);
    const debts = this.debtsDecrypt(userId);
    debts.forEach(item => {
      if( item.contacts === contactId){
        item['dateOrder'] = this._utilities.convertStringToDate(item.createDate);
        debtsSelects.push(item);
      }
    });
    return debtsSelects.sort((x, y) => y.dateOrder - x.dateOrder);
  }

  getDebtsByIsPaid(userId, contactId,status){
    const debts = this.getDebtsByIdContact(userId, contactId);
    return debts.filter(item => {return item.isPaid === status});
  }

  calculateValues(oDebt){
    oDebt.createDate = this._utilities.getTodayFormat();

    if(oDebt.typeDebt === 'interesFijo'){
      oDebt.debtTotalValue = Math.round(oDebt.debtValue +
                            ((oDebt.fixedInterest / 100) *
                             oDebt.debtValue));

    }else if (oDebt.typeDebt === 'sinIntereses'){
      oDebt.debtTotalValue = oDebt.debtValue;
    }

    return oDebt;
  }

  async updateDebtByUid(userId,oDebt){
    const debtRef = doc(this._firestore, `/users/${userId}/debts/${oDebt.uid}`);

    const lastUpdateDate = this._utilities.getTodayFormat();
    const respUpdate = await updateDoc(debtRef, {
      sumPaid        :oDebt.sumPaid,
      isPaid         :oDebt.isPaid,
      lastDateUpdate :lastUpdateDate
    });
    if(respUpdate === undefined){
      const debts = this.debtsDecrypt(userId);
      debts.forEach(item => {
        if(item.uid === oDebt.uid){
          item.sumPaid = oDebt.sumPaid;
          item.isPaid  = oDebt.isPaid;
          item.lastDateUpdate = lastUpdateDate;
        }
      });
      this.debtsEncript(JSON.stringify(debts));
      return true;
    }

  }

  async updateDebtByUidGeneralPay(userId,oDebt){
    const debtRef = doc(this._firestore, `/users/${userId}/debts/${oDebt.uid}`);

    const lastUpdateDate = this._utilities.getTodayFormat();
    const respUpdate = await updateDoc(debtRef, {
      sumPaid        :oDebt.sumPaid,
      isPaid         :oDebt.isPaid,
      lastDateUpdate :lastUpdateDate
    });
    if(respUpdate === undefined){
      const debts = this.debtsDecrypt(userId);
      debts.forEach(item => {
        if(item.uid === oDebt.uid){
          item.sumPaid        = oDebt.sumPaid;
          item.isPaid         = oDebt.isPaid;
          item.lastDateUpdate = lastUpdateDate;
        }
      });
      this.debtsEncript(JSON.stringify(debts));
    }
    return true;
  }

  getIdDebtsForGeneralPay(userId, valuePay, idContact) {
    let uIds = [];
    const debts = this.getDebtsByIsPaid(userId, idContact, false).reverse();

    for (let index = 0; index < debts.length; index++) {
      const item = debts[index];
      if (valuePay >= item.totalValue && valuePay !== 0) {

        valuePay = Number(valuePay) - Number(item.totalValue);
        uIds.push({
          uid       : item.uid.toString(),
          value     : Number(item.totalValue),
          isPayTotal: true
        });

      }else if(valuePay < item.totalValue && valuePay > 0){

        uIds.push({
          uid       : item.uid.toString(),
          value     : Number(valuePay),
          isPayTotal: false
        });
        valuePay = 0;
      }
    }

    return uIds;
  }
}
