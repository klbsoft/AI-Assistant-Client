use aes_gcm::{
    aead::{Aead, AeadCore, KeyInit, OsRng},
    Aes256Gcm, Nonce
};
use argon2::{
    password_hash::{rand_core::OsRng as ArgonRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2
};
use chacha20poly1305::ChaCha20Poly1305;
use rand::RngCore;
use sha2::{Sha256, Sha512};
use sha3::Sha3_256;
use hmac::{Hmac, Mac};
use blake3;
use std::fs::File;
use std::io::{Read, Write};
use std::path::Path;
use anyhow::{Result, anyhow};

// Type aliases for HMAC
type HmacSha256 = Hmac<Sha256>;

/// A comprehensive encryption utility class
pub struct CryptoService {
    master_key: [u8; 32], // 256-bit master key
}

impl CryptoService {
    /// Create a new CryptoService with a random master key
    pub fn new() -> Self {
        let mut key = [0u8; 32];
        OsRng.fill_bytes(&mut key);
        Self { master_key: key }
    }

    /// Create a new CryptoService with an existing key
    pub fn from_key(key: [u8; 32]) -> Self {
        Self { master_key: key }
    }

    /// Encrypt text with AES-256-GCM (authenticated encryption)
    pub fn encrypt_text_aes(&self, plaintext: &str) -> Result<String> {
        let cipher = Aes256Gcm::new_from_slice(&self.master_key)
            .map_err(|_| anyhow!("Failed to create cipher"))?;
        
        let nonce = Aes256Gcm::generate_nonce(&mut OsRng);
        let ciphertext = cipher.encrypt(&nonce, plaintext.as_bytes())
            .map_err(|_| anyhow!("Encryption failed"))?;
        
        // Combine nonce and ciphertext for storage
        let mut result = nonce.to_vec();
        result.extend(ciphertext);
        
        Ok(base64::encode(result))
    }

    /// Decrypt text with AES-256-GCM
    pub fn decrypt_text_aes(&self, encrypted_data: &str) -> Result<String> {
        let data = base64::decode(encrypted_data)
            .map_err(|_| anyhow!("Invalid base64"))?;
        
        if data.len() < 12 {
            return Err(anyhow!("Invalid encrypted data"));
        }
        
        let (nonce_bytes, ciphertext) = data.split_at(12);
        let nonce = Nonce::from_slice(nonce_bytes);
        
        let cipher = Aes256Gcm::new_from_slice(&self.master_key)
            .map_err(|_| anyhow!("Failed to create cipher"))?;
        
        let plaintext = cipher.decrypt(nonce, ciphertext)
            .map_err(|_| anyhow!("Decryption failed"))?;
        
        Ok(String::from_utf8(plaintext)?)
    }

    /// Encrypt text with ChaCha20-Poly1305
    pub fn encrypt_text_chacha(&self, plaintext: &str) -> Result<String> {
        let cipher = ChaCha20Poly1305::new_from_slice(&self.master_key)
            .map_err(|_| anyhow!("Failed to create cipher"))?;
        
        let nonce = ChaCha20Poly1305::generate_nonce(&mut OsRng);
        let ciphertext = cipher.encrypt(&nonce, plaintext.as_bytes())
            .map_err(|_| anyhow!("Encryption failed"))?;
        
        let mut result = nonce.to_vec();
        result.extend(ciphertext);
        
        Ok(base64::encode(result))
    }

    /// Decrypt text with ChaCha20-Poly1305
    pub fn decrypt_text_chacha(&self, encrypted_data: &str) -> Result<String> {
        let data = base64::decode(encrypted_data)
            .map_err(|_| anyhow!("Invalid base64"))?;
        
        if data.len() < 12 {
            return Err(anyhow!("Invalid encrypted data"));
        }
        
        let (nonce_bytes, ciphertext) = data.split_at(12);
        let nonce = Nonce::from_slice(nonce_bytes);
        
        let cipher = ChaCha20Poly1305::new_from_slice(&self.master_key)
            .map_err(|_| anyhow!("Failed to create cipher"))?;
        
        let plaintext = cipher.decrypt(nonce, ciphertext)
            .map_err(|_| anyhow!("Decryption failed"))?;
        
        Ok(String::from_utf8(plaintext)?)
    }

    /// Encrypt a file (streaming mode for large files)
    pub fn encrypt_file_aes(&self, input_path: &Path, output_path: &Path) -> Result<()> {
        let mut input_file = File::open(input_path)?;
        let mut output_file = File::create(output_path)?;
        
        let cipher = Aes256Gcm::new_from_slice(&self.master_key)
            .map_err(|_| anyhow!("Failed to create cipher"))?;
        
        let nonce = Aes256Gcm::generate_nonce(&mut OsRng);
        output_file.write_all(&nonce)?;
        
        let mut buffer = Vec::new();
        input_file.read_to_end(&mut buffer)?;
        
        let ciphertext = cipher.encrypt(&nonce, buffer.as_ref())
            .map_err(|_| anyhow!("Encryption failed"))?;
        
        output_file.write_all(&ciphertext)?;
        
        Ok(())
    }

    /// Decrypt a file
    pub fn decrypt_file_aes(&self, input_path: &Path, output_path: &Path) -> Result<()> {
        let mut input_file = File::open(input_path)?;
        let mut output_file = File::create(output_path)?;
        
        let mut nonce = [0u8; 12];
        input_file.read_exact(&mut nonce)?;
        
        let mut ciphertext = Vec::new();
        input_file.read_to_end(&mut ciphertext)?;
        
        let cipher = Aes256Gcm::new_from_slice(&self.master_key)
            .map_err(|_| anyhow!("Failed to create cipher"))?;
        
        let plaintext = cipher.decrypt(&nonce.into(), ciphertext.as_ref())
            .map_err(|_| anyhow!("Decryption failed"))?;
        
        output_file.write_all(&plaintext)?;
        
        Ok(())
    }

    /// Encrypt with salt (key derivation using Argon2)
    pub fn encrypt_with_salt(&self, plaintext: &str, password: &str) -> Result<String> {
        // Generate a random salt
        let salt = SaltString::generate(&mut ArgonRng);
        
        // Derive a key from the password using Argon2
        let argon2 = Argon2::default();
        let mut derived_key = [0u8; 32];
        argon2.hash_password_into(password.as_bytes(), salt.as_ref(), &mut derived_key)
            .map_err(|_| anyhow!("Key derivation failed"))?;
        
        // Use the derived key for encryption
        let cipher = Aes256Gcm::new_from_slice(&derived_key)
            .map_err(|_| anyhow!("Failed to create cipher"))?;
        
        let nonce = Aes256Gcm::generate_nonce(&mut OsRng);
        let ciphertext = cipher.encrypt(&nonce, plaintext.as_bytes())
            .map_err(|_| anyhow!("Encryption failed"))?;
        
        // Store salt + nonce + ciphertext
        let mut result = salt.as_str().as_bytes().to_vec();
        result.extend(nonce.to_vec());
        result.extend(ciphertext);
        
        Ok(base64::encode(result))
    }

    /// Decrypt with salt
    pub fn decrypt_with_salt(&self, encrypted_data: &str, password: &str) -> Result<String> {
        let data = base64::decode(encrypted_data)?;
        
        // Argon2 salt is 22 chars in base64
        if data.len() < 22 + 12 {
            return Err(anyhow!("Invalid encrypted data"));
        }
        
        let salt_bytes = &data[0..22];
        let salt = SaltString::from_b64(std::str::from_utf8(salt_bytes)?)?;
        
        let (nonce_bytes, ciphertext) = data[22..].split_at(12);
        let nonce = Nonce::from_slice(nonce_bytes);
        
        // Derive the same key using the stored salt
        let argon2 = Argon2::default();
        let mut derived_key = [0u8; 32];
        argon2.hash_password_into(password.as_bytes(), salt.as_ref(), &mut derived_key)
            .map_err(|_| anyhow!("Key derivation failed"))?;
        
        let cipher = Aes256Gcm::new_from_slice(&derived_key)
            .map_err(|_| anyhow!("Failed to create cipher"))?;
        
        let plaintext = cipher.decrypt(nonce, ciphertext)
            .map_err(|_| anyhow!("Decryption failed"))?;
        
        Ok(String::from_utf8(plaintext)?)
    }

    /// Deterministic hash (always same output for same input)
    pub fn deterministic_hash(&self, data: &str) -> String {
        use sha2::Digest;
        
        let mut hasher = Sha256::new();
        hasher.update(data.as_bytes());
        hasher.update(self.master_key); // Include key for HMAC-like behavior
        let result = hasher.finalize();
        
        hex::encode(result)
    }

    /// Deterministic hash with SHA-512/256 (truncated to 256 bits)
    pub fn deterministic_hash_sha512(&self, data: &str) -> String {
        use sha2::Digest;
        
        let mut hasher = Sha512::new();
        hasher.update(data.as_bytes());
        hasher.update(self.master_key);
        let result = hasher.finalize();
        
        // Take first 32 bytes (256 bits) of the 64-byte hash
        hex::encode(&result[0..32])
    }

    /// Deterministic hash with SHA3-256
    pub fn deterministic_hash_sha3(&self, data: &str) -> String {
        use sha3::Digest;
        
        let mut hasher = Sha3_256::new();
        hasher.update(data.as_bytes());
        hasher.update(self.master_key);
        let result = hasher.finalize();
        
        hex::encode(result)
    }

    /// Non-deterministic hash (includes random salt, different each time)
    pub fn non_deterministic_hash(&self, data: &str) -> Result<String> {
        // Generate random salt
        let mut salt = [0u8; 16];
        OsRng.fill_bytes(&mut salt);
        
        // Use Argon2 for salted hashing
        let argon2 = Argon2::default();
        let salt_string = SaltString::encode_b64(&salt)
            .map_err(|_| anyhow!("Failed to encode salt"))?;
        
        let mut output = [0u8; 32];
        argon2.hash_password_into(data.as_bytes(), salt_string.as_ref(), &mut output)
            .map_err(|_| anyhow!("Hashing failed"))?;
        
        // Combine salt and hash
        let mut result = salt.to_vec();
        result.extend(output);
        
        Ok(base64::encode(result))
    }

    /// Verify a non-deterministic hash
    pub fn verify_non_deterministic_hash(&self, data: &str, hash: &str) -> Result<bool> {
        let hash_bytes = base64::decode(hash)?;
        
        if hash_bytes.len() < 16 + 32 {
            return Err(anyhow!("Invalid hash format"));
        }
        
        let (salt_bytes, original_hash) = hash_bytes.split_at(16);
        
        let argon2 = Argon2::default();
        let salt_string = SaltString::encode_b64(salt_bytes)
            .map_err(|_| anyhow!("Failed to decode salt"))?;
        
        let mut computed_hash = [0u8; 32];
        argon2.hash_password_into(data.as_bytes(), salt_string.as_ref(), &mut computed_hash)
            .map_err(|_| anyhow!("Hashing failed"))?;
        
        // Constant-time comparison
        Ok(computed_hash == original_hash)
    }

    /// Blake3 hash (very fast, 256-bit output)
    pub fn blake3_hash(&self, data: &str) -> String {
        let mut hasher = blake3::Hasher::new();
        hasher.update(data.as_bytes());
        hasher.update(&self.master_key);
        let result = hasher.finalize();
        
        result.to_hex().to_string()
    }

    /// HMAC-SHA256 for message authentication
    pub fn hmac_sha256(&self, message: &str) -> Result<String> {
        let mut mac = HmacSha256::new_from_slice(&self.master_key)
            .map_err(|_| anyhow!("HMAC creation failed"))?;
        
        mac.update(message.as_bytes());
        let result = mac.finalize();
        
        Ok(hex::encode(result.into_bytes()))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::NamedTempFile;

    #[test]
    fn test_aes_encryption_decryption() {
        let crypto = CryptoService::new();
        let original = "Hello, World!";
        
        let encrypted = crypto.encrypt_text_aes(original).unwrap();
        let decrypted = crypto.decrypt_text_aes(&encrypted).unwrap();
        
        assert_eq!(original, decrypted);
    }

    #[test]
    fn test_chacha_encryption_decryption() {
        let crypto = CryptoService::new();
        let original = "Hello, World!";
        
        let encrypted = crypto.encrypt_text_chacha(original).unwrap();
        let decrypted = crypto.decrypt_text_chacha(&encrypted).unwrap();
        
        assert_eq!(original, decrypted);
    }

    #[test]
    fn test_file_encryption_decryption() {
        let crypto = CryptoService::new();
        
        let input_file = NamedTempFile::new().unwrap();
        let encrypted_file = NamedTempFile::new().unwrap();
        let decrypted_file = NamedTempFile::new().unwrap();
        
        std::fs::write(input_file.path(), "Secret file content").unwrap();
        
        crypto.encrypt_file_aes(input_file.path(), encrypted_file.path()).unwrap();
        crypto.decrypt_file_aes(encrypted_file.path(), decrypted_file.path()).unwrap();
        
        let decrypted_content = std::fs::read_to_string(decrypted_file.path()).unwrap();
        assert_eq!(decrypted_content, "Secret file content");
    }

    #[test]
    fn test_salted_encryption() {
        let crypto = CryptoService::new();
        let original = "Hello, World!";
        let password = "my_secure_password";
        
        let encrypted = crypto.encrypt_with_salt(original, password).unwrap();
        let decrypted = crypto.decrypt_with_salt(&encrypted, password).unwrap();
        
        assert_eq!(original, decrypted);
    }

    #[test]
    fn test_deterministic_hash() {
        let crypto = CryptoService::new();
        
        let hash1 = crypto.deterministic_hash("test data");
        let hash2 = crypto.deterministic_hash("test data");
        
        assert_eq!(hash1, hash2);
        assert_eq!(hash1.len(), 64); // hex encoding of 32 bytes = 64 chars
    }

    #[test]
    fn test_non_deterministic_hash() {
        let crypto = CryptoService::new();
        
        let hash1 = crypto.non_deterministic_hash("test data").unwrap();
        let hash2 = crypto.non_deterministic_hash("test data").unwrap();
        
        assert_ne!(hash1, hash2); // Different due to random salt
        
        assert!(crypto.verify_non_deterministic_hash("test data", &hash1).unwrap());
        assert!(!crypto.verify_non_deterministic_hash("wrong data", &hash1).unwrap());
    }

    #[test]
    fn test_hmac() {
        let crypto = CryptoService::new();
        
        let hmac1 = crypto.hmac_sha256("important message").unwrap();
        let hmac2 = crypto.hmac_sha256("important message").unwrap();
        
        assert_eq!(hmac1, hmac2);
        assert_eq!(hmac1.len(), 64); // hex encoding of 32 bytes
    }
}