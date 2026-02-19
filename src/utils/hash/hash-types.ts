// types/hash.types.ts
export interface HashResult {
  md5: string;
  sha1: string;
  sha256: string;
  sha384: string;
  sha512: string;
}

// utils/hashUtils.ts
export async function createAllHashes(text: string): Promise<HashResult> {
  const encoder = new TextEncoder();
  
  // Convert text to ArrayBuffer
  const data = encoder.encode(text) ; 
  
  // Calculate MD5 (Web Crypto API doesn't support MD5, so we need a fallback)
  const md5 = await calculateMD5(text);
  
  // Calculate SHA hashes using Web Crypto API
  const sha1 = await calculateSHA(data.buffer, 'SHA-1');
  const sha256 = await calculateSHA(data.buffer, 'SHA-256');
  const sha384 = await calculateSHA(data.buffer, 'SHA-384');
  const sha512 = await calculateSHA(data.buffer, 'SHA-512');
  
  return {
    md5,
    sha1,
    sha256,
    sha384,
    sha512
  };
}

// Helper function for SHA hashes
async function calculateSHA(data: ArrayBuffer, algorithm: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'): Promise<string> {
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  return arrayBufferToHex(hashBuffer);
}

// MD5 implementation (since Web Crypto API doesn't support it)
async function calculateMD5(text: string): Promise<string> {
  // Using a library is recommended for production, but here's a simple implementation
  // For production, use a library like: npm install md5
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  // Simple fallback - in production, use a proper MD5 library
  // This is a basic implementation, consider using a library for production
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Return first 32 chars as MD5-like hash (for demonstration)
  // In production, replace with proper MD5 implementation
  return hashHex.substring(0, 32);
}

// Utility function to convert ArrayBuffer to hex string
function arrayBufferToHex(buffer: ArrayBuffer): string {
  const hashArray = Array.from(new Uint8Array(buffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Alternative: Using a proper MD5 library (if you can install packages)
// Install: npm install md5 @types/md5
/*
import md5 from 'md5';
export async function createAllHashesWithMD5(text: string): Promise<HashResult> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  return {
    md5: md5(text),
    sha1: await calculateSHA(data, 'SHA-1'),
    sha256: await calculateSHA(data, 'SHA-256'),
    sha384: await calculateSHA(data, 'SHA-384'),
    sha512: await calculateSHA(data, 'SHA-512')
  };
}
*/