import CryptoJS from 'crypto-js';

export class CryptoUtils {
  static generateKeyPair() {
    const privateKey = CryptoJS.lib.WordArray.random(32);
    const publicKey = CryptoJS.SHA256(privateKey);
    return { privateKey, publicKey };
  }

  static sign(data, privateKey) {
    return CryptoJS.HmacSHA512(JSON.stringify(data), privateKey).toString();
  }

  static verify(data, signature, publicKey) {
    const computedSignature = CryptoJS.HmacSHA512(JSON.stringify(data), publicKey).toString();
    return computedSignature === signature;
  }

  static encrypt(data, key) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
  }

  static decrypt(ciphertext, key) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  static hash(data) {
    return CryptoJS.SHA256(JSON.stringify(data)).toString();
  }
}