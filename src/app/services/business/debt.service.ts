import { Injectable } from '@angular/core';
import { User } from '../../models/shared/user';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  doc,
  setDoc,
  deleteDoc, getDoc, updateDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CryptoJsService } from '../shared/crypto-js.service';
import { v4 as uuidv4 } from 'uuid';


@Injectable({
  providedIn: 'root'
})
export class DebtService {

  constructor(
    private _firestore: Firestore,
    private router: Router,
    private criptoService: CryptoJsService
  ) {

  }

  addDebt(userId, debt) {
    debugger;
    const guid = uuidv4();
    const contactRef2 = doc(this._firestore, `/users/${userId}/debts/${guid}`);
    const contactTocreate = {
      uid:          guid,
      concept:      debt.concept,
      contacts:     debt.contacts,
      debtValue:    debt.debtValue,
      isFixedFees:  debt.isFixedFees,
      isGroupDebt:  debt.isGroupDebt,
      payDate:      debt.payDate,
      typeDebt:     debt.typeDebt
    }

    return setDoc(contactRef2, contactTocreate);

  }



}
