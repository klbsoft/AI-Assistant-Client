import * as crypto from 'crypto';

// Simple AES-256-CBC encryption/decryption
export function encryptAES(text: string, password: string): string {
  const iv = crypto.randomBytes(16); // 16 bytes for AES
  const key = crypto.scryptSync(password, 'salt', 32); // 32 bytes = 256 bits
  
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Return IV + encrypted data
  return iv.toString('hex') + ':' + encrypted;
}

export function decryptAES(encryptedText: string, password: string): string {
  const [ivHex, encrypted] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const key = crypto.scryptSync(password, 'salt', 32);
  
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}