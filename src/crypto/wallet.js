import CryptoJS from 'crypto-js';

class Wallet {
  constructor(ownerNode) {
    this.ownerNode = ownerNode;
    this.balance = 1000; // Initial balance
    this.privateKey = CryptoJS.lib.WordArray.random(32).toString();
    this.publicKey = CryptoJS.SHA256(this.privateKey).toString();
    this.transactions = [];
  }

  createTransaction(recipient, amount, message = '') {
    if (amount > this.balance) {
      throw new Error('Insufficient funds');
    }

    const transaction = {
      from: this.publicKey,
      to: recipient,
      amount,
      message: message ? CryptoJS.AES.encrypt(message, this.privateKey).toString() : '',
      timestamp: Date.now(),
      signature: this.signTransaction(amount, recipient)
    };

    return transaction;
  }

  signTransaction(amount, recipient) {
    const data = `${this.publicKey}${recipient}${amount}${Date.now()}`;
    return CryptoJS.HmacSHA256(data, this.privateKey).toString();
  }

  verifyTransaction(transaction) {
    const data = `${transaction.from}${transaction.to}${transaction.amount}${transaction.timestamp}`;
    const signature = CryptoJS.HmacSHA256(data, this.privateKey).toString();
    return signature === transaction.signature;
  }

  processTransaction(transaction) {
    if (transaction.to === this.publicKey) {
      this.balance += transaction.amount;
      if (transaction.message) {
        try {
          const decryptedMessage = CryptoJS.AES.decrypt(transaction.message, this.privateKey).toString(CryptoJS.enc.Utf8);
          transaction.decryptedMessage = decryptedMessage;
        } catch (error) {
          transaction.decryptedMessage = null;
        }
      }
      this.transactions.push(transaction);
      return true;
    }
    return false;
  }

  getBalance() {
    return this.balance;
  }

  getTransactionHistory() {
    return this.transactions;
  }
}

export default Wallet;