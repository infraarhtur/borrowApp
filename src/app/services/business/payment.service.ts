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
export class PaymentService {

  constructor(
    private _userService:   UserService,
    private _firestore:     Firestore,
    private router:         Router,
    private criptoService:  CryptoJsService
  ) {

  }

  addPayment(userId, oPyment){
    const guid = uuidv4();
    const today = new Date();
    oPyment.createDate = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
    const paymentRef2 = doc(this._firestore, `/users/${userId}/pyments/${guid}`);

    const paymentToCreate = {
      uid:            guid,
      valuePayment:   oPyment.valuePayment,
      commentPayment: oPyment.commentPayment,
      createDate:     oPyment.createDate,
      type:           oPyment.typePayment,
      contactId:      oPyment.idContact
    };
    return setDoc(paymentRef2, paymentToCreate);
  }
}
