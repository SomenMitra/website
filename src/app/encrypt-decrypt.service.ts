import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptDecryptService {

  constructor() { }

  encText(plainText) {
    let encKey = environment.encryptKey;
    let text = plainText;
    let iv = CryptoJS.enc.Hex.parse(environment.encryptIV);
    return btoa(CryptoJS.AES.encrypt(text, encKey, { iv: iv }).toString());
  }

  decText(encryptedText) {
    encryptedText = atob(encryptedText);
    let encKey = environment.encryptKey;
    let iv = CryptoJS.enc.Hex.parse(environment.encryptIV);
    var decryptText = CryptoJS.AES.decrypt(encryptedText, encKey, { iv: iv });
    return decryptText.toString(CryptoJS.enc.Utf8);
  }
}
