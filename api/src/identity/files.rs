use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};


#[derive(Debug, Serialize, Deserialize)]

pub struct File {
    pub id: i64,
    pub file_id: String,
    pub user_id: i64,
    pub chat_id: Option<i64>,
    pub message_id: Option<i64>,
    pub name: String,
    pub storage_path: String,
    pub mime_type: String,
    pub size_bytes: i64,
    pub encryption_iv: Option<String>,
    pub encryption_algo: Option<String>,
    pub hash_sha256: Option<String>,
    pub uploaded_at: NaiveDateTime,
}
