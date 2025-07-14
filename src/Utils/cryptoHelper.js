import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;;

// Encrypt function
export const encryptData = (data) => {
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

// Decrypt function
export const decryptData = (ciphertext) => {
  try {
    if (!ciphertext || !ciphertext.startsWith("U2FsdGVkX1")) {
    //   console.warn("Invalid ciphertext, skipping decryption.");
      return null;
    }

    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedData) {
      throw new Error("Empty decrypted data");
    }

    return JSON.parse(decryptedData);
  } catch (error) {
    console.error('Decryption error:', error.message || error);
    return null;
  }
};


