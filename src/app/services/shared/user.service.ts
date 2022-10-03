import { Injectable } from '@angular/core';
import { User } from '../../models/shared/user';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  doc,
  setDoc,
  deleteDoc, getDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private _firestore: Firestore
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

  getUsersById(uid:string){
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

  async getInfoDoc(uid:string){
   return await getDoc(this.getUsersById(uid));
  }



}
