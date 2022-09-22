import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoJsService {
  public urlBase = '';
  public keyCripto = '';
  constructor() {
    this.keyCripto = environment.criptoJsKey;
    this.urlBase = environment.urlBaseServicio;
  }

  encryptUsingAES256(strToEncript:any) {
    if (!strToEncript){
      return
    }

    let _key = CryptoJS.enc.Utf8.parse(this.keyCripto);
    let _iv = CryptoJS.enc.Utf8.parse(this.keyCripto);
    let encrypted = CryptoJS.AES.encrypt(
      strToEncript, _key, {
      keySize: 16,
      iv: _iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }

  decryptUsingAES256(strEncript:any) {
  if (!strEncript){
    return
  }

    let _key = CryptoJS.enc.Utf8.parse(this.keyCripto);
    let _iv = CryptoJS.enc.Utf8.parse(this.keyCripto);

    return CryptoJS.AES.decrypt(
      strEncript, _key, {
      keySize: 16,
      iv: _iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
  }
}
