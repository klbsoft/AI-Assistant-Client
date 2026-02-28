use serde::{Serialize, Deserialize};
use chrono::NaiveDateTime;
use std::fs;
use std::path::{Path, PathBuf};
use anyhow::{Result, Context};

pub struct SessionHandler{
    Sessions:Vec<Session>,
    pub max_in_mem: usize,
}

//pub fn skip_until(&mut self,first_char :String ,second_char: String) -> bool {

pub impl SessionHandler{
    pub fn new()->Self{
        self.Sessions = Vec::new(); 
        self.max_in_mem = 1024*1024*100; 
        return Self;
    }

    pub fn add(&mut self,session: &Session)
    {
        if self.Sessions.len() < self.max_in_mem{
            self.Sessions.push(session);
            return;
        }else{

        }
    }
}





 
impl SessionHandler {
    /// Save a single session to disk as JSON
    pub fn save_to_disk(&self, base_path: &str) -> Result<()> {
        // Create filename from token (sanitize it first)
        let filename = format!("session_{}.json", sanitize_filename(&self.token));
        let filepath = Path::new(base_path).join(filename);
        
        // Ensure directory exists
        if let Some(parent) = filepath.parent() {
            fs::create_dir_all(parent)
                .with_context(|| format!("Failed to create directory: {:?}", parent))?;
        }
        
        // Write JSON to file
        let json = serde_json::to_string_pretty(self)
            .with_context(|| "Failed to serialize session")?;
        
        fs::write(&filepath, json)
            .with_context(|| format!("Failed to write session to: {:?}", filepath))?;
        
        println!("Session saved to: {:?}", filepath);
        Ok(())
    }
    
    /// Load a single session from disk by token
    pub fn load_from_disk(base_path: &str, token: &str) -> Result<Option<Self>> {
        let filename = format!("session_{}.json", sanitize_filename(token));
        let filepath = Path::new(base_path).join(filename);
        
        if !filepath.exists() {
            return Ok(None);
        }
        
        let json = fs::read_to_string(&filepath)
            .with_context(|| format!("Failed to read session file: {:?}", filepath))?;
        
        let session: Session = serde_json::from_str(&json)
            .with_context(|| "Failed to deserialize session")?;
        
        Ok(Some(session))
    }
    
    /// Delete a session file from disk
    pub fn delete_from_disk(base_path: &str, token: &str) -> Result<bool> {
        let filename = format!("session_{}.json", sanitize_filename(token));
        let filepath = Path::new(base_path).join(filename);
        
        if filepath.exists() {
            fs::remove_file(&filepath)
                .with_context(|| format!("Failed to delete session file: {:?}", filepath))?;
            Ok(true)
        } else {
            Ok(false)
        }
    }
}

/// Helper function to sanitize filename (remove invalid characters)
fn sanitize_filename(token: &str) -> String {
    token.chars()
        .map(|c| match c {
            'a'..='z' | 'A'..='Z' | '0'..='9' | '-' | '_' => c,
            _ => '_',
        })
        .collect()
}