import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.CHAT_ENCRYPTION_KEY || 'your-32-byte-secret-key-for-aes-256!!';

export const encryptMessage = (message) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

export const decryptMessage = (encryptedMessage) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};