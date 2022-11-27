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
import { iif, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CryptoJsService } from '../shared/crypto-js.service';
import { v4 as uuidv4 } from 'uuid';
import { getDocs } from 'firebase/firestore';

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
    const guid = uuidv4();
    const contactRef2 = doc(this._firestore, `/users/${userId}/contacts/${guid}`);
    const today = new Date();
    const createDate = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
    const contactTocreate = {
      uid: guid,
      email: contact.emailContact,
      nickname: contact.nickName,
      phoneNumber: contact.numberPhone,
      indicative: '+' + contact.indicative,
      createDate: createDate
    }

    return setDoc(contactRef2, contactTocreate);

  }



  async getContactsByUserId(userId) {
    let contacts =[];
    const querySnapshot = await getDocs(collection(this._firestore,`users/${userId}/contacts`));

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      contacts.push(doc.data());
    });
    return contacts;
  }

  contactsEncript(contacts){
    const contactsEncrypt = this.criptoService.encryptUsingAES256(contacts);
    localStorage.setItem('contacts',contactsEncrypt);
  }
  contactsDecrypt(){
    const contactsEncrypt = localStorage.getItem('contacts');
    const contactsDecrypt = this.criptoService.decryptUsingAES256(contactsEncrypt);
    return JSON.parse(contactsDecrypt)
  }

  getContactbyIdContact(idContact){
    const contacts = this.contactsDecrypt();
    let contact;
    contacts.forEach(item => {
      if (item.uid === idContact){
        contact = item;
      }
    })
    return contact
  }
}
