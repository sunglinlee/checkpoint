-- 資料庫遷移腳本：檢查和修復重複帳號問題
-- 執行前請先備份資料庫！

-- ==========================================
-- 1. 檢查現有重複帳號問題
-- ==========================================

-- 檢查是否有相同email但不同認證方式的帳號
SELECT 
    email,
    COUNT(*) as account_count,
    SUM(CASE WHEN password IS NOT NULL AND password != '' THEN 1 ELSE 0 END) as has_password_count,
    SUM(CASE WHEN google_id IS NOT NULL AND google_id != '' THEN 1 ELSE 0 END) as has_google_count
FROM users 
GROUP BY email 
HAVING COUNT(*) > 1 
   OR (SUM(CASE WHEN password IS NOT NULL AND password != '' THEN 1 ELSE 0 END) > 0 
       AND SUM(CASE WHEN google_id IS NOT NULL AND google_id != '' THEN 1 ELSE 0 END) > 0);

-- 詳細檢視重複帳號資訊
SELECT 
    email,
    id,
    name,
    CASE 
        WHEN password IS NOT NULL AND password != '' THEN 'regular'
        WHEN google_id IS NOT NULL AND google_id != '' THEN 'google'
        ELSE 'unknown'
    END as auth_method,
    created_at,
    updated_at
FROM users 
WHERE email IN (
    SELECT email 
    FROM users 
    GROUP BY email 
    HAVING COUNT(*) > 1
)
ORDER BY email, created_at;

-- ==========================================
-- 2. 資料表結構優化
-- ==========================================

-- 確保必要欄位存在
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT;

-- 建立索引提升查詢效能
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);

-- ==========================================
-- 3. 資料清理建議（請謹慎執行）
-- ==========================================

-- 注意：以下腳本會修改資料，執行前請先備份！

-- 方案A：保留最早建立的帳號，刪除重複的
-- （僅在確認重複帳號確實是問題時執行）
/*
DELETE u1 FROM users u1
INNER JOIN users u2 
WHERE u1.email = u2.email 
  AND u1.id > u2.id 
  AND u1.created_at > u2.created_at;
*/

-- 方案B：合併帳號資訊（保留最完整的資料）
-- 這個需要根據具體業務邏輯調整
/*
UPDATE users u1
SET 
    name = COALESCE(u1.name, (
        SELECT u2.name 
        FROM users u2 
        WHERE u2.email = u1.email AND u2.id != u1.id 
        LIMIT 1
    )),
    avatar = COALESCE(u1.avatar, (
        SELECT u2.avatar 
        FROM users u2 
        WHERE u2.email = u1.email AND u2.id != u1.id 
        LIMIT 1
    ))
WHERE EXISTS (
    SELECT 1 FROM users u2 
    WHERE u2.email = u1.email AND u2.id != u1.id
);
*/

-- ==========================================
-- 4. 新增約束防止未來重複
-- ==========================================

-- 確保email唯一性（如果還沒有的話）
-- 注意：如果現在有重複email，需要先清理才能加這個約束
-- ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE(email);

-- ==========================================
-- 5. 驗證腳本
-- ==========================================

-- 驗證沒有重複email
SELECT 
    email, 
    COUNT(*) as count 
FROM users 
GROUP BY email 
HAVING COUNT(*) > 1;

-- 驗證認證方式分布
SELECT 
    CASE 
        WHEN password IS NOT NULL AND password != '' AND (google_id IS NULL OR google_id = '') THEN 'regular_only'
        WHEN (password IS NULL OR password = '') AND google_id IS NOT NULL AND google_id != '' THEN 'google_only'
        WHEN password IS NOT NULL AND password != '' AND google_id IS NOT NULL AND google_id != '' THEN 'both_methods'
        ELSE 'no_auth_method'
    END as auth_status,
    COUNT(*) as user_count
FROM users 
GROUP BY auth_status;

-- 檢查資料完整性
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN email IS NOT NULL AND email != '' THEN 1 END) as has_email,
    COUNT(CASE WHEN name IS NOT NULL AND name != '' THEN 1 END) as has_name,
    COUNT(CASE WHEN password IS NOT NULL AND password != '' THEN 1 END) as has_password,
    COUNT(CASE WHEN google_id IS NOT NULL AND google_id != '' THEN 1 END) as has_google_id
FROM users;

-- ==========================================
-- 6. 測試資料（開發環境用）
-- ==========================================

-- 插入測試資料來驗證API功能
/*
-- 一般認證用戶
INSERT INTO users (email, name, password, created_at, updated_at) 
VALUES ('test-regular@example.com', '一般用戶', '$2b$10$hashedpassword', NOW(), NOW());

-- Google認證用戶  
INSERT INTO users (email, name, google_id, avatar, created_at, updated_at) 
VALUES ('test-google@example.com', 'Google用戶', 'google123456', 'https://example.com/avatar.jpg', NOW(), NOW());

-- 無認證方式用戶（異常情況）
INSERT INTO users (email, name, created_at, updated_at) 
VALUES ('test-noauth@example.com', '無認證用戶', NOW(), NOW());
*/

-- ==========================================
-- 7. 監控查詢
-- ==========================================

-- 定期執行以監控資料品質
CREATE VIEW IF NOT EXISTS user_auth_summary AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_registrations,
    SUM(CASE WHEN password IS NOT NULL AND password != '' THEN 1 ELSE 0 END) as regular_auth,
    SUM(CASE WHEN google_id IS NOT NULL AND google_id != '' THEN 1 ELSE 0 END) as google_auth,
    SUM(CASE WHEN (password IS NULL OR password = '') AND (google_id IS NULL OR google_id = '') THEN 1 ELSE 0 END) as no_auth
FROM users 
GROUP BY DATE(created_at)
ORDER BY date DESC;