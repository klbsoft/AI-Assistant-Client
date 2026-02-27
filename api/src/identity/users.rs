use chrono::NaiveDateTime;
use serde:: {Serialize, Deserialize};
 
#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub id: i64,
    pub username: String,
    pub email: String,
    pub password_hash: String,
    pub salt: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}
