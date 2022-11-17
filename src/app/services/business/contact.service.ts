import { Injectable } from '@angular/core';
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
export class ContactService {

  constructor(
    private _firestore: Firestore,
    private router: Router,
    private criptoService: CryptoJsService
  ) {

  }

  addContact(userId, contact) {
    debugger;
    const guid = uuidv4();
    const contactRef2 = doc(this._firestore, `/users/6oz0sYjGkVgcx0cnePWTLhJusvf2/contacts/${guid}`);
    const contactTocreate = {
      uid: guid,
      email: 'pruebacontact@contacto2.com',
      nickname: 'contacto',
      phoneNumber: '3208965723',
      indicative: '+57'
    }

    return setDoc(contactRef2, contactTocreate);

  }
}
