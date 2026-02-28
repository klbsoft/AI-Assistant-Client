use std::fs;
use rusqlite::{Connection,Result,params,Row};
use crate::identity::users::User;
use crate::identity::chats::Chat;
use crate::identity::sessions::Session;
use crate::identity::files::File;



#[derive(Debug)]
pub struct Sqlitedb {
    conn: Connection,
}

impl Sqlitedb {
    pub fn new(db_path: &str, schema: &str) -> Self {
        let conn = Connection::open(db_path).unwrap();

        let schema_content = fs::read_to_string(schema).unwrap();

        conn.execute_batch(&schema_content).unwrap();
        return Self { conn }  
    }
}

impl Sqlitedb{

pub fn debug_dump(&self) -> Result<()> {
    let tables = ["users", "sessions", "chats", "messages", "files"];

    for table in tables {
        println!("\n===== TABLE: {} =====", table);

        let query = format!("SELECT * FROM {}", table);
        let mut stmt = self.conn.prepare(&query)?;

        let column_count = stmt.column_count();

        let rows = stmt.query_map([], |row| {
            for i in 0..column_count {
                let value: Result<String, _> = row.get(i);
                match value {
                    Ok(v) => print!("{} | ", v),
                    Err(_) => print!("NULL | "),
                }
            }
            println!();
            Ok(())
        })?;

        for _ in rows {} // just iterate to execute
    }

    Ok(())
}
}







impl Sqlitedb {
    // =========================
    // USERS CRUD
    // =========================
    
    pub fn user_exists(&self, username: &str, email: &str) -> Result<bool> {
        let mut stmt = self.conn.prepare(
            "SELECT COUNT(*) FROM users WHERE username = ?1 OR email = ?2"
        )?;
      let count: i64 = stmt.query_row(params![username, email], |row: &rusqlite::Row| {
            row.get(0)  // This returns Result<i64, rusqlite::Error>
        })?;  // Outer ? converts to your function's error type
        Ok(count > 0)
    }
/* 
    pub fn create_user(&self, user: &User) -> Result<i64> {
        self.conn.execute(
            "INSERT INTO users (username, email, password_hash, salt, created_at, updated_at) 
             VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            params![
                user.username,
                user.email,
                user.password_hash,
                user.salt,
                user.created_at,
                user.updated_at,
            ],
        )?;
        
        Ok(self.conn.last_insert_rowid())
    }

    pub fn get_user_by_id(&self, user_id: i64) -> Result<Option<User>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, username, email, password_hash, salt, created_at, updated_at 
             FROM users WHERE id = ?1"
        )?;
        
        let user = stmt.query_row(params![user_id], |row| {
            Ok(User {
                id: row.get(0)?,
                username: row.get(1)?,
                email: row.get(2)?,
                password_hash: row.get(3)?,
                salt: row.get(4)?,
                created_at: row.get(5)?,
                updated_at: row.get(6)?,
            })
        }).optional()?;
        
        Ok(user)
    }

    pub fn get_user_by_username(&self, username: &str) -> Result<Option<User>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, username, email, password_hash, salt, created_at, updated_at 
             FROM users WHERE username = ?1"
        )?;
        
        let user = stmt.query_row(params![username], |row| {
            Ok(User {
                id: row.get(0)?,
                username: row.get(1)?,
                email: row.get(2)?,
                password_hash: row.get(3)?,
                salt: row.get(4)?,
                created_at: row.get(5)?,
                updated_at: row.get(6)?,
            })
        }).optional()?;
        
        Ok(user)
    }

    pub fn get_user_by_email(&self, email: &str) -> Result<Option<User>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, username, email, password_hash, salt, created_at, updated_at 
             FROM users WHERE email = ?1"
        )?;
        
        let user = stmt.query_row(params![email], |row| {
            Ok(User {
                id: row.get(0)?,
                username: row.get(1)?,
                email: row.get(2)?,
                password_hash: row.get(3)?,
                salt: row.get(4)?,
                created_at: row.get(5)?,
                updated_at: row.get(6)?,
            })
        }).optional()?;
        
        Ok(user)
    }

    pub fn get_user_by_login(&self, login: &str) -> Result<Option<User>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, username, email, password_hash, salt, created_at, updated_at 
             FROM users WHERE username = ?1 OR email = ?1"
        )?;
        
        let user = stmt.query_row(params![login], |row| {
            Ok(User {
                id: row.get(0)?,
                username: row.get(1)?,
                email: row.get(2)?,
                password_hash: row.get(3)?,
                salt: row.get(4)?,
                created_at: row.get(5)?,
                updated_at: row.get(6)?,
            })
        }).optional()?;
        
        Ok(user)
    }

    pub fn update_user(&self, user: &User) -> Result<usize> {
        let rows_affected = self.conn.execute(
            "UPDATE users SET 
                username = ?1, 
                email = ?2, 
                password_hash = ?3, 
                salt = ?4, 
                updated_at = ?5 
             WHERE id = ?6",
            params![
                user.username,
                user.email,
                user.password_hash,
                user.salt,
                user.updated_at,
                user.id,
            ],
        )?;
        
        Ok(rows_affected)
    }

    pub fn delete_user(&self, user_id: i64) -> Result<usize> {
        let rows_affected = self.conn.execute(
            "DELETE FROM users WHERE id = ?1",
            params![user_id],
        )?;
        
        Ok(rows_affected)
    }

    pub fn get_all_users(&self) -> Result<Vec<User>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, username, email, password_hash, salt, created_at, updated_at FROM users"
        )?;
        
        let users = stmt.query_map([], |row| {
            Ok(User {
                id: row.get(0)?,
                username: row.get(1)?,
                email: row.get(2)?,
                password_hash: row.get(3)?,
                salt: row.get(4)?,
                created_at: row.get(5)?,
                updated_at: row.get(6)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;
        
        Ok(users)
    }
    */

    // =========================
    // SESSIONS CRUD
    // =========================
/* 
    pub fn session_exists(&self, token: &str) -> Result<bool> {
        let mut stmt = self.conn.prepare(
            "SELECT COUNT(*) FROM sessions WHERE token = ?1"
        )?;
        
        let count: i64 = stmt.query_row(params![token], |row| row.get(0))?;
        
        Ok(count > 0)
    }

    pub fn create_session(&self, session: &Session) -> Result<i64> {
        self.conn.execute(
            "INSERT INTO sessions (user_id, token, expires_at, created_at) 
             VALUES (?1, ?2, ?3, ?4)",
            params![
                session.user_id,
                session.token,
                session.expires_at,
                session.created_at,
            ],
        )?;
        
        Ok(self.conn.last_insert_rowid())
    }

    pub fn get_session_by_token(&self, token: &str) -> Result<Option<Session>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, user_id, token, expires_at, created_at 
             FROM sessions WHERE token = ?1"
        )?;
        
        let session = stmt.query_row(params![token], |row| {
            Ok(Session {
                id: row.get(0)?,
                user_id: row.get(1)?,
                token: row.get(2)?,
                expires_at: row.get(3)?,
                created_at: row.get(4)?,
            })
        }).optional()?;
        
        Ok(session)
    }

    pub fn get_sessions_by_user_id(&self, user_id: i64) -> Result<Vec<Session>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, user_id, token, expires_at, created_at 
             FROM sessions WHERE user_id = ?1"
        )?;
        
        let sessions = stmt.query_map(params![user_id], |row| {
            Ok(Session {
                id: row.get(0)?,
                user_id: row.get(1)?,
                token: row.get(2)?,
                expires_at: row.get(3)?,
                created_at: row.get(4)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;
        
        Ok(sessions)
    }

    pub fn delete_session(&self, token: &str) -> Result<usize> {
        let rows_affected = self.conn.execute(
            "DELETE FROM sessions WHERE token = ?1",
            params![token],
        )?;
        
        Ok(rows_affected)
    }

    pub fn delete_expired_sessions(&self) -> Result<usize> {
        let now = Utc::now().naive_utc();
        let rows_affected = self.conn.execute(
            "DELETE FROM sessions WHERE expires_at < ?1",
            params![now],
        )?;
        
        Ok(rows_affected)
    }

    pub fn delete_all_user_sessions(&self, user_id: i64) -> Result<usize> {
        let rows_affected = self.conn.execute(
            "DELETE FROM sessions WHERE user_id = ?1",
            params![user_id],
        )?;
        
        Ok(rows_affected)
    }

    // =========================
    // CHATS CRUD
    // =========================

    pub fn chat_exists(&self, chat_id: &str) -> Result<bool> {
        let mut stmt = self.conn.prepare(
            "SELECT COUNT(*) FROM chats WHERE chat_id = ?1"
        )?;
        
        let count: i64 = stmt.query_row(params![chat_id], |row| row.get(0))?;
        
        Ok(count > 0)
    }

    pub fn create_chat(&self, chat: &Chat) -> Result<i64> {
        self.conn.execute(
            "INSERT INTO chats (chat_id, user_id, title, created_at, updated_at) 
             VALUES (?1, ?2, ?3, ?4, ?5)",
            params![
                chat.chat_id,
                chat.user_id,
                chat.title,
                chat.created_at,
                chat.updated_at,
            ],
        )?;
        
        Ok(self.conn.last_insert_rowid())
    }

    pub fn get_chat_by_id(&self, chat_id: &str) -> Result<Option<Chat>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, chat_id, user_id, title, created_at, updated_at 
             FROM chats WHERE chat_id = ?1"
        )?;
        
        let chat = stmt.query_row(params![chat_id], |row| {
            Ok(Chat {
                id: row.get(0)?,
                chat_id: row.get(1)?,
                user_id: row.get(2)?,
                title: row.get(3)?,
                created_at: row.get(4)?,
                updated_at: row.get(5)?,
            })
        }).optional()?;
        
        Ok(chat)
    }

    pub fn get_chats_by_user_id(&self, user_id: i64) -> Result<Vec<Chat>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, chat_id, user_id, title, created_at, updated_at 
             FROM chats WHERE user_id = ?1 
             ORDER BY updated_at DESC"
        )?;
        
        let chats = stmt.query_map(params![user_id], |row| {
            Ok(Chat {
                id: row.get(0)?,
                chat_id: row.get(1)?,
                user_id: row.get(2)?,
                title: row.get(3)?,
                created_at: row.get(4)?,
                updated_at: row.get(5)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;
        
        Ok(chats)
    }

    pub fn update_chat(&self, chat: &Chat) -> Result<usize> {
        let rows_affected = self.conn.execute(
            "UPDATE chats SET 
                title = ?1, 
                updated_at = ?2 
             WHERE chat_id = ?3",
            params![
                chat.title,
                chat.updated_at,
                chat.chat_id,
            ],
        )?;
        
        Ok(rows_affected)
    }

    pub fn delete_chat(&self, chat_id: &str) -> Result<usize> {
        let rows_affected = self.conn.execute(
            "DELETE FROM chats WHERE chat_id = ?1",
            params![chat_id],
        )?;
        
        Ok(rows_affected)
    }
    */

    // =========================
    // MESSAGES CRUD
    // =========================
/* 
    pub fn message_exists(&self, message_id: &str) -> Result<bool> {
        let mut stmt = self.conn.prepare(
            "SELECT COUNT(*) FROM messages WHERE message_id = ?1"
        )?;
        
        let count: i64 = stmt.query_row(params![message_id], |row| row.get(0))?;
        
        Ok(count > 0)
    }

    pub fn create_message(&self, message: &Message) -> Result<i64> {
        self.conn.execute(
            "INSERT INTO messages (message_id, chat_id, user_id, content_type, content, role, status, created_at) 
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
            params![
                message.message_id,
                message.chat_id,
                message.user_id,
                message.content_type,
                message.content,
                message.role,
                message.status,
                message.created_at,
            ],
        )?;
        
        Ok(self.conn.last_insert_rowid())
    }

    pub fn get_message_by_id(&self, message_id: &str) -> Result<Option<Message>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, message_id, chat_id, user_id, content_type, content, role, status, created_at 
             FROM messages WHERE message_id = ?1"
        )?;
        
        let message = stmt.query_row(params![message_id], |row| {
            Ok(Message {
                id: row.get(0)?,
                message_id: row.get(1)?,
                chat_id: row.get(2)?,
                user_id: row.get(3)?,
                content_type: row.get(4)?,
                content: row.get(5)?,
                role: row.get(6)?,
                status: row.get(7)?,
                created_at: row.get(8)?,
            })
        }).optional()?;
        
        Ok(message)
    }

    pub fn get_messages_by_chat_id(&self, chat_id: i64) -> Result<Vec<Message>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, message_id, chat_id, user_id, content_type, content, role, status, created_at 
             FROM messages WHERE chat_id = ?1 
             ORDER BY created_at ASC"
        )?;
        
        let messages = stmt.query_map(params![chat_id], |row| {
            Ok(Message {
                id: row.get(0)?,
                message_id: row.get(1)?,
                chat_id: row.get(2)?,
                user_id: row.get(3)?,
                content_type: row.get(4)?,
                content: row.get(5)?,
                role: row.get(6)?,
                status: row.get(7)?,
                created_at: row.get(8)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;
        
        Ok(messages)
    }

    pub fn get_messages_by_user_id(&self, user_id: i64) -> Result<Vec<Message>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, message_id, chat_id, user_id, content_type, content, role, status, created_at 
             FROM messages WHERE user_id = ?1 
             ORDER BY created_at DESC"
        )?;
        
        let messages = stmt.query_map(params![user_id], |row| {
            Ok(Message {
                id: row.get(0)?,
                message_id: row.get(1)?,
                chat_id: row.get(2)?,
                user_id: row.get(3)?,
                content_type: row.get(4)?,
                content: row.get(5)?,
                role: row.get(6)?,
                status: row.get(7)?,
                created_at: row.get(8)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;
        
        Ok(messages)
    }

    pub fn update_message_status(&self, message_id: &str, status: &str) -> Result<usize> {
        let rows_affected = self.conn.execute(
            "UPDATE messages SET status = ?1 WHERE message_id = ?2",
            params![status, message_id],
        )?;
        
        Ok(rows_affected)
    }

    pub fn delete_message(&self, message_id: &str) -> Result<usize> {
        let rows_affected = self.conn.execute(
            "DELETE FROM messages WHERE message_id = ?1",
            params![message_id],
        )?;
        
        Ok(rows_affected)
    }

    pub fn delete_all_chat_messages(&self, chat_id: i64) -> Result<usize> {
        let rows_affected = self.conn.execute(
            "DELETE FROM messages WHERE chat_id = ?1",
            params![chat_id],
        )?;
        
        Ok(rows_affected)
    }
*/
    // =========================
    // FILES CRUD
    // =========================
/* 
    pub fn file_exists(&self, file_id: &str) -> Result<bool> {
        let mut stmt = self.conn.prepare(
            "SELECT COUNT(*) FROM files WHERE file_id = ?1"
        )?;
        
        let count: i64 = stmt.query_row(params![file_id], |row| row.get(0))?;
        
        Ok(count > 0)
    }

    pub fn create_file(&self, file: &File) -> Result<i64> {
        self.conn.execute(
            "INSERT INTO files (
                file_id, user_id, chat_id, message_id, name, 
                storage_path, mime_type, size_bytes, 
                encryption_iv, encryption_algo, hash_sha256, uploaded_at
             ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)",
            params![
                file.file_id,
                file.user_id,
                file.chat_id,
                file.message_id,
                file.name,
                file.storage_path,
                file.mime_type,
                file.size_bytes,
                file.encryption_iv,
                file.encryption_algo,
                file.hash_sha256,
                file.uploaded_at,
            ],
        )?;
        
        Ok(self.conn.last_insert_rowid())
    }

    pub fn get_file_by_id(&self, file_id: &str) -> Result<Option<File>> {
        let mut stmt = self.conn.prepare(
            "SELECT 
                id, file_id, user_id, chat_id, message_id, name, 
                storage_path, mime_type, size_bytes, 
                encryption_iv, encryption_algo, hash_sha256, uploaded_at
             FROM files WHERE file_id = ?1"
        )?;
        
        let file = stmt.query_row(params![file_id], |row| {
            Ok(File {
                id: row.get(0)?,
                file_id: row.get(1)?,
                user_id: row.get(2)?,
                chat_id: row.get(3)?,
                message_id: row.get(4)?,
                name: row.get(5)?,
                storage_path: row.get(6)?,
                mime_type: row.get(7)?,
                size_bytes: row.get(8)?,
                encryption_iv: row.get(9)?,
                encryption_algo: row.get(10)?,
                hash_sha256: row.get(11)?,
                uploaded_at: row.get(12)?,
            })
        }).optional()?;
        
        Ok(file)
    }

    pub fn get_files_by_user_id(&self, user_id: i64) -> Result<Vec<File>> {
        let mut stmt = self.conn.prepare(
            "SELECT 
                id, file_id, user_id, chat_id, message_id, name, 
                storage_path, mime_type, size_bytes, 
                encryption_iv, encryption_algo, hash_sha256, uploaded_at
             FROM files WHERE user_id = ?1 
             ORDER BY uploaded_at DESC"
        )?;
        
        let files = stmt.query_map(params![user_id], |row| {
            Ok(File {
                id: row.get(0)?,
                file_id: row.get(1)?,
                user_id: row.get(2)?,
                chat_id: row.get(3)?,
                message_id: row.get(4)?,
                name: row.get(5)?,
                storage_path: row.get(6)?,
                mime_type: row.get(7)?,
                size_bytes: row.get(8)?,
                encryption_iv: row.get(9)?,
                encryption_algo: row.get(10)?,
                hash_sha256: row.get(11)?,
                uploaded_at: row.get(12)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;
        
        Ok(files)
    }

    pub fn get_files_by_chat_id(&self, chat_id: i64) -> Result<Vec<File>> {
        let mut stmt = self.conn.prepare(
            "SELECT 
                id, file_id, user_id, chat_id, message_id, name, 
                storage_path, mime_type, size_bytes, 
                encryption_iv, encryption_algo, hash_sha256, uploaded_at
             FROM files WHERE chat_id = ?1 
             ORDER BY uploaded_at DESC"
        )?;
        
        let files = stmt.query_map(params![chat_id], |row| {
            Ok(File {
                id: row.get(0)?,
                file_id: row.get(1)?,
                user_id: row.get(2)?,
                chat_id: row.get(3)?,
                message_id: row.get(4)?,
                name: row.get(5)?,
                storage_path: row.get(6)?,
                mime_type: row.get(7)?,
                size_bytes: row.get(8)?,
                encryption_iv: row.get(9)?,
                encryption_algo: row.get(10)?,
                hash_sha256: row.get(11)?,
                uploaded_at: row.get(12)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;
        
        Ok(files)
    }
    */


/* 
    pub fn get_files_by_message_id(&self, message_id: i64) -> Result<Vec<File>> {
        let mut stmt = self.conn.prepare(
            "SELECT 
                id, file_id, user_id, chat_id, message_id, name, 
                storage_path, mime_type, size_bytes, 
                encryption_iv, encryption_algo, hash_sha256, uploaded_at
             FROM files WHERE message_id = ?1"
        )?;
        
        let files = stmt.query_map(params![message_id], |row| {
            Ok(File {
                id: row.get(0)?,
                file_id: row.get(1)?,
                user_id: row.get(2)?,
                chat_id: row.get(3)?,
                message_id: row.get(4)?,
                name: row.get(5)?,
                storage_path: row.get(6)?,
                mime_type: row.get(7)?,
                size_bytes: row.get(8)?,
                encryption_iv: row.get(9)?,
                encryption_algo: row.get(10)?,
                hash_sha256: row.get(11)?,
                uploaded_at: row.get(12)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;
        
        Ok(files)
    }
    */
    /*
    pub fn update_file_message(&self, file_id: &str, message_id: Option<i64>) -> Result<usize> {
        let rows_affected = self.conn.execute(
            "UPDATE files SET message_id = ?1 WHERE file_id = ?2",
            params![message_id, file_id],
        )?;
        
        Ok(rows_affected)
    }
    */
    /* 
    pub fn delete_file(&self, file_id: &str) -> Result<usize> {
        let rows_affected = self.conn.execute(
            "DELETE FROM files WHERE file_id = ?1",
            params![file_id],
        )?;
        
        Ok(rows_affected)
    }*/
    /* 
    pub fn delete_files_by_user_id(&self, user_id: i64) -> Result<usize> {
        let rows_affected = self.conn.execute(
            "DELETE FROM files WHERE user_id = ?1",
            params![user_id],
        )?;
        
        Ok(rows_affected)
    }*/
}
