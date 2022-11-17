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
import { CryptoJsService } from './crypto-js.service';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private _firestore: Firestore,
    private router: Router,
    private criptoService: CryptoJsService,
  ) {

  }


  addUser(user: User) {

    const userRef2 = doc(this._firestore, `users/${user.uid}`,);
    const userTocreate = {
      uid: user.uid,
      email: user.email,
      nickname: user.nickname,
      phoneNumber: user.phoneNumber,
      indicative: user.indicative,
      isTermsConditions: false,
      rol: 'Client',
      emailVerified: user.emailVerified
    }

    return setDoc(userRef2, userTocreate);
  }

  getUsers(): Observable<User[]> {
    const userRef = collection(this._firestore, 'users');
    return collectionData(userRef, { idField: 'id' }) as Observable<User[]>;
  }

  getUsersById(uid: string) {
    const userRef = doc(this._firestore, `users/${uid}`);
    return userRef;
  }


  deleteUser(id: string) {
    const userRef = doc(this._firestore, `users/${id}`);
    console.log('userRef', userRef)
    return deleteDoc(userRef).then(result => {
      return result;
    }).catch(error => {
      alert(error)
    })
  }

  async getInfoDoc(uid: string) {
    return await getDoc(this.getUsersById(uid));
  }

  async updateInfoUser(idUser, newInfoUser) {
    let infoUser = this.getUsersById(idUser);

    return await updateDoc(infoUser, newInfoUser)

  }

  async saveDataAditional(uId) {
    const userInfo = await this.getInfoDoc(uId);
    console.log(userInfo.data())
    localStorage.setItem('aditionalInfo',this.criptoService.encryptUsingAES256(
      JSON.stringify(userInfo.data())
      ));

  }
  getAditionalData() {
    return JSON.parse(this.criptoService.decryptUsingAES256(
      localStorage.getItem('aditionalInfo')));
  }



  async verifyTermns() {

    const isinfoAditional = this.criptoService.decryptUsingAES256( localStorage.getItem('aditionalInfo'));

    if (isinfoAditional === null) {
      const user = this.criptoService.decryptUsingAES256(localStorage.getItem('user'));
      const objUser = JSON.parse(user)
      await this.saveDataAditional(objUser.uid)
      const aditionalData = this.getAditionalData()
      if (!aditionalData.isTermsConditions) {
        this.router.navigate(['user'])
      }

    }

  }

  getUserLocal(){
    const userEncript= localStorage.getItem('user');
    const userDesencript = this.criptoService.decryptUsingAES256(userEncript);
    return JSON.parse(userDesencript);
  }

}
