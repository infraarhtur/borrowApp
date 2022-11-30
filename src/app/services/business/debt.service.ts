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


@Injectable({
  providedIn: 'root'
})
export class DebtService {

  constructor(
    private _userService: UserService,
    private _firestore: Firestore,
    private router: Router,
    private criptoService: CryptoJsService
  ) {

  }

  addDebt(userId, debt) {
    const guid = uuidv4();
    const contactRef2 = doc(this._firestore, `/users/${userId}/debts/${guid}`);
    const today = new Date();
    const createDate = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();

    const contactTocreate = {
      uid: guid,
      concept: debt.concept,
      contacts: debt.contacts,
      debtValue: debt.debtValue,
      isFixedFees: debt.isFixedFees,
      isGroupDebt: debt.isGroupDebt,
      payDate: debt.payDate,
      typeDebt: debt.typeDebt,
      createDate: createDate
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
    const user = this._userService.getUserLocal();

    if (localStorage.getItem('debts') === null) {
      const debts = await this.getDebtsByIdUser(user.uid);
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

  getTotalDebtsByidUser(userId) {
    let totalDebt = 0;
    this.verifyDebtsByIdUserWithSession(userId);
    const debts = this.debtsDecrypt(userId);
    console.log('debts', debts);
    debts.forEach(item => {
      totalDebt += item.debtValue;
    });
    return totalDebt;
  }


  getTotalDebtsByidContact(userId, contactId) {
    let totalDebt = 0;
    this.verifyDebtsByIdUserWithSession(userId);
    const debts = this.debtsDecrypt(userId);
    debts.forEach(item => {
      if( item.contacts === contactId){
        totalDebt += item.debtValue;
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
        debtsSelects.push(item);
      }
    });
    return debtsSelects;
  }
}
