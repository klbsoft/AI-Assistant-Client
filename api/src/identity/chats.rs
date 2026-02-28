use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};



#[derive(Debug, Serialize, Deserialize)]
pub struct Chat {
    pub id: i64,
    pub chat_id: String,
    pub user_id: i64,
    pub title: Option<String>, // nullable
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

