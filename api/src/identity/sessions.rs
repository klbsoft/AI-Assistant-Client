use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Session {
    pub id: i64,
    pub user_id: i64,
    pub token: String,
    pub expires_at: NaiveDateTime,
    pub created_at: NaiveDateTime,
}


impl Session{
    pub fn new(id:i64,user_id:i64,token:String,expires_at:NaiveDateTime,created_at:NaiveDateTime) -> Self{
      //  let is_valid = session.

      return Self{id:id,user_id:user_id,token:token,expires_at:expires_at,created_at:created_at}; 
    }
}