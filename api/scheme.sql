PRAGMA foreign_keys = ON;

-- =========================
-- USERS
-- =========================
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- SESSIONS
-- =========================
CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id
ON sessions(user_id);

-- =========================
-- CHATS
-- =========================
CREATE TABLE IF NOT EXISTS chats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chat_id TEXT NOT NULL UNIQUE,
    user_id INTEGER NOT NULL,
    title TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_chats_user_id
ON chats(user_id);

-- =========================
-- MESSAGES
-- =========================
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id TEXT NOT NULL UNIQUE,
    chat_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content_type TEXT NOT NULL,   -- example: 'text', 'image', 'audio'
    content BLOB NOT NULL,        -- supports TEXT or binary
    role TEXT NOT NULL,           -- 'user', 'assistant', etc.
    status TEXT NOT NULL CHECK (
        status IN ('sent','delivered','read','error')
    ),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (chat_id)
        REFERENCES chats(id)
        ON DELETE CASCADE,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_messages_chat_id
ON messages(chat_id);

CREATE INDEX IF NOT EXISTS idx_messages_user_id
ON messages(user_id);

-- =========================
-- FILES
-- =========================
CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_id TEXT NOT NULL UNIQUE,
    user_id INTEGER NOT NULL,
    chat_id INTEGER,
    message_id INTEGER,
    name TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    encryption_iv TEXT,
    encryption_algo TEXT,
    hash_sha256 TEXT,
    uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (chat_id)
        REFERENCES chats(id)
        ON DELETE SET NULL,

    FOREIGN KEY (message_id)
        REFERENCES messages(id)
        ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_files_user_id
ON files(user_id);

CREATE INDEX IF NOT EXISTS idx_files_chat_id
ON files(chat_id);

CREATE INDEX IF NOT EXISTS idx_files_message_id
ON files(message_id);