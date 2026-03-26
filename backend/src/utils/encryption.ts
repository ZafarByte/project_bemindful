import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = process.env.ENCRYPTION_KEY || 'bemindful_secret_key_2024_secure'; 
const IV_LENGTH = 16; 

export const encrypt = (text: string): string => {
  if (!text) return text;
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = crypto.createHash('sha256').update(SECRET_KEY).digest(); 
    
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  } catch (error) {
    console.error("Encryption error:", error);
    return text;
  }
};

export const decrypt = (text: string): string => {
  if (!text) return text;
  try {
      const textParts = text.split(':');
      if (textParts.length < 2) return text; // Not in our format

      const iv = Buffer.from(textParts.shift()!, 'hex');
      const encryptedText = Buffer.from(textParts.join(':'), 'hex');
      const key = crypto.createHash('sha256').update(SECRET_KEY).digest();
      
      const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
      let decrypted = decipher.update(encryptedText);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString();
  } catch (err) {
      // console.error("Decryption failed", err);
      // It might be regular text if migration hasn't happened.
      return text; 
  }
};
