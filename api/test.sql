BEGIN TRANSACTION;

-- =========================
-- CREATE ONE USER
-- =========================
INSERT INTO users (username, email, password_hash, salt)
VALUES (
    'test_user_01',
    'test_user_01@example.com',
    'hashed_password_example',
    'random_salt_value'
);

-- We assume this is ID = 1 since DB is fresh
-- If not fresh, you can replace 1 with (SELECT id FROM users WHERE username='test_user_01')

-- =========================
-- SESSIONS
-- =========================
INSERT INTO sessions (user_id, token, expires_at)
VALUES
(1, 'token_abc123', datetime('now', '+7 days')),
(1, 'token_def456', datetime('now', '+14 days')),
(1, 'token_ghi789', datetime('now', '+30 days'));

-- =========================
-- CHATS
-- =========================
INSERT INTO chats (chat_id, user_id, title)
VALUES
('chat_001', 1, 'General Discussion'),
('chat_002', 1, 'Project Ideas'),
('chat_003', 1, 'Random Thoughts');

-- =========================
-- MESSAGES
-- =========================
-- Chat 1 Messages
INSERT INTO messages (message_id, chat_id, user_id, content_type, content, role, status)
VALUES
('msg_001', 1, 1, 'text', 'Hello world!', 'user', 'sent'),
('msg_002', 1, 1, 'text', 'How are you today?', 'user', 'read'),
('msg_003', 1, 1, 'text', 'This is a test message.', 'assistant', 'delivered');

-- Chat 2 Messages
INSERT INTO messages (message_id, chat_id, user_id, content_type, content, role, status)
VALUES
('msg_004', 2, 1, 'text', 'Project brainstorm session.', 'user', 'sent'),
('msg_005', 2, 1, 'text', 'We should build something cool.', 'assistant', 'read');

-- Chat 3 Messages
INSERT INTO messages (message_id, chat_id, user_id, content_type, content, role, status)
VALUES
('msg_006', 3, 1, 'text', 'Random late night thought.', 'user', 'sent');

-- =========================
-- FILES
-- =========================
INSERT INTO files (
    file_id,
    user_id,
    chat_id,
    message_id,
    name,
    storage_path,
    mime_type,
    size_bytes,
    encryption_iv,
    encryption_algo,
    hash_sha256
)
VALUES
(
    'file_001',
    1,
    1,
    1,
    'image1.png',
    '/storage/user1/image1.png',
    'image/png',
    204800,
    'random_iv_123',
    'AES-256',
    'fakehashsha256value123'
),
(
    'file_002',
    1,
    2,
    4,
    'document.pdf',
    '/storage/user1/document.pdf',
    'application/pdf',
    1048576,
    'random_iv_456',
    'AES-256',
    'fakehashsha256value456'
);

COMMIT;