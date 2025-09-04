# API 文檔

## 概述
此文檔描述了前端與後端 API 的整合方式。所有 API 呼叫都通過 `src/api/client.js` 中的 `apiRequest` 函數進行。

## 基礎設定

### API 基底網址
- **開發環境**: `/api` (通過 Vite 代理到後端)
- **生產環境**: `https://checkpoint-backend-357565914560.asia-east1.run.app`
- **自訂**: 可通過環境變數 `VITE_API_BASE_URL` 設定

### 認證
所有需要認證的 API 呼叫會自動在請求標頭中加入 JWT token：
```
Authorization: Bearer {token}
```

### 欄位對應說明
**重要**: 前端使用 `nickname` 欄位，但後端資料庫期望 `name` 欄位。API 層會自動進行對應轉換。

## 用戶相關 API

### 認證方式說明
本系統支援兩種認證方式：
1. **一般註冊/登入**: 使用 email + password
2. **Google 第三方認證**: 使用 Google OAuth，透過 mailRegister/mailLogin 端點

### 1. 一般註冊
```javascript
import { registerUser } from '../api/auth';

const result = await registerUser({
    nickname: '用戶暱稱',  // 前端使用 nickname
    email: 'user@example.com',
    password: 'password123'
});
```

**端點**: `POST /user/register`
**前端參數**:
- `nickname` (string): 用戶暱稱
- `email` (string): 電子郵件
- `password` (string): 密碼

**後端接收參數**:
- `name` (string): 用戶暱稱 (由 nickname 轉換)
- `email` (string): 電子郵件
- `password` (string): 密碼

### 2. Google 第三方註冊 (mailRegister)
```javascript
import { mailRegister } from '../api/auth';

const result = await mailRegister({
    nickname: '用戶暱稱',  // 前端使用 nickname
    email: 'user@example.com',
    googleId: 'google_user_id_123',  // Google 用戶 ID
    avatar: 'https://lh3.googleusercontent.com/...'  // Google 頭像 URL (optional)
});
```

**端點**: `POST /user/mailRegister`
**用途**: Google OAuth 第三方登入註冊
**參數**:
- `nickname` (string): 用戶暱稱 (從 Google 資料取得)
- `email` (string): 電子郵件 (從 Google 資料取得)
- `googleId` (string): Google 用戶唯一識別碼
- `avatar` (string, optional): Google 頭像 URL

### 3. 一般登入
```javascript
import { loginUser } from '../api/auth';

const result = await loginUser({
    email: 'user@example.com',
    password: 'password123'
});
```

**端點**: `POST /user/login`
**參數**:
- `email` (string): 電子郵件
- `password` (string): 密碼

### 4. Google 第三方登入 (mailLogin)
```javascript
import { mailLogin } from '../api/auth';

const result = await mailLogin({
    email: 'user@example.com',
    googleId: 'google_user_id_123'
});
```

**端點**: `POST /user/mailLogin`
**用途**: Google OAuth 第三方登入
**參數**:
- `email` (string): 電子郵件 (從 Google 資料取得)
- `googleId` (string): Google 用戶唯一識別碼

### 5. 登出
```javascript
import { logoutUser } from '../api/auth';

const result = await logoutUser({
    email: 'user@example.com',
    password: 'password123'
});
```

**端點**: `POST /user/logout`
**參數**:
- `email` (string): 電子郵件
- `password` (string): 密碼

### 6. 刷新 Token
```javascript
import { refreshToken } from '../api/auth';

const result = await refreshToken('user@example.com');
```

**端點**: `GET /user/refreshToken?email={email}`
**參數**:
- `email` (query parameter): 電子郵件

### 7. 密碼修改
```javascript
import { changePassword } from '../api/auth';

const result = await changePassword({
    email: 'user@example.com',
    currentPassword: '目前密碼',
    newPassword: '新密碼'
});
```

**端點**: `POST /user/changePassword`
**參數**:
- `email` (string): 電子郵件
- `currentPassword` (string): 目前密碼
- `newPassword` (string): 新密碼

**狀態碼**:
- `0000`: 密碼修改成功
- `1002`: 目前密碼錯誤
- `1003`: 新密碼格式不正確

**注意事項**:
- 新密碼必須至少 8 個字元
- 只有非 Google 登入用戶才能修改密碼
- 需要提供正確的目前密碼進行驗證

### 8. 暱稱修改
```javascript
import { updateNickname } from '../api/auth';

const result = await updateNickname({
    email: 'user@example.com',
    nickname: '新暱稱'
});
```

**端點**: `POST /user/change`
**前端參數**:
- `email` (string): 電子郵件
- `nickname` (string): 新暱稱

**後端接收參數**:
- `email` (string): 電子郵件
- `name` (string): 新暱稱 (由 nickname 轉換)

**狀態碼**:
- `0000`: 暱稱修改成功
- `1004`: 暱稱已被使用
- `1005`: 暱稱格式不正確

**注意事項**:
- 暱稱不能超過 20 個字元
- 暱稱不能為空
- 所有用戶（包括 Google 登入用戶）都可以修改暱稱

## 認證管理

### 儲存認證
```javascript
import { persistAuth } from '../api/auth';

persistAuth(token, user);
```

### 清除認證
```javascript
import { clearAuth } from '../api/auth';

clearAuth();
```

### 載入認證
```javascript
import { loadAuth } from '../api/auth';

const { token, user } = loadAuth();
```

## 錯誤處理

所有 API 呼叫都會自動處理錯誤並拋出包含以下資訊的 Error 物件：
- `message`: 錯誤訊息
- `status`: HTTP 狀態碼
- `data`: 後端回傳的錯誤資料

```javascript
try {
    const result = await loginUser(credentials);
} catch (error) {
    console.error('登入失敗:', error.message);
    console.error('狀態碼:', error.status);
    console.error('錯誤詳情:', error.data);
}
```

## 測試 API

可以使用內建的測試函數來測試所有 API 端點：

```javascript
import { testAllAPIs } from '../api/auth';

// 在瀏覽器控制台中執行
testAllAPIs().then(success => {
    if (success) {
        console.log('所有 API 測試通過！');
    } else {
        console.log('部分 API 測試失敗');
    }
});
```

## 環境變數設定

在 `.env` 檔案中設定：

```bash
# API 基底網址（可選）
VITE_API_BASE_URL=https://your-backend.example.com

# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
```

## 注意事項

1. **開發環境**: 使用 `/api` 路徑，Vite 會自動代理到後端
2. **生產環境**: 直接呼叫後端 API
3. **認證**: JWT token 會自動從 localStorage 中取得並加入請求標頭
4. **錯誤處理**: 所有 API 錯誤都會統一處理並拋出標準化的 Error 物件
5. **CORS**: 後端需要設定適當的 CORS 政策以允許前端存取
6. **欄位對應**: 前端 `nickname` 會自動轉換為後端 `name` 欄位

## 問卷與快照相關 API

### 圖片分配邏輯說明

每個快照會根據用戶的心情自動分配一張預設圖片，儲存在 `assigned_image` 欄位中：

**心情與圖片對應關係**:
- `平靜`: 平靜1.png, 平靜2.png, 平靜3.png
- `開心`: 開心1.jpg, 開心2.jpg, 開心3.jpg  
- `興奮`: 興奮1.jpg, 興奮2.jpg, 興奮3.jpg
- `溫暖`: 溫暖1.jpg, 溫暖2.jpg, 溫暖3.jpg
- `焦慮但充滿希望`: 焦慮但充滿希望1.jpg, 焦慮但充滿希望2.jpg, 焦慮但充滿希望3.jpg
- `沮喪`: 沮喪1.jpg, 沮喪2.jpg, 沮喪3.jpg
- `其他`: 預設使用平靜系列圖片

**分配規則**:
1. 系統會為每個用戶維護一個圖片使用記錄
2. 優先選擇該心情下未使用過的圖片
3. 如果該心情的所有圖片都已使用，則重置記錄並重新隨機分配
4. 圖片路徑格式: `/素材/{圖片檔名}`

### 1. 提交問卷答案 (QuestionnairePage)
```javascript
import { apiRequest } from '../api/client';

const submitQuestionnaire = async (questionnaireData) => {
    return await apiRequest('/questionnaire/submit', {
        method: 'POST',
        body: questionnaireData
    });
};
```

**端點**: `POST /questionnaire/submit`
**需要認證**: 是
**參數**:
```javascript
{
    // 生活滿意度
    "satisfaction": {
        "rating": 7,                    // number (1-10)
        "reason": "整體來說還算滿意..."   // string
    },
    
    // 感受美好的瞬間
    "gratitude": {
        "grateful_events": "1. 今天早上看到陽光...",  // string
        "share_with": "我的家人和最好的朋友",        // string
        "inspiration": "這些小事提醒我要珍惜當下..."  // string
    },
    
    // 你所關注的世界
    "focus": {
        "current_events": "最近關注氣候變遷...",     // string
        "feelings": "有些擔憂但也充滿希望...",       // string
        "actions": "開始減少使用一次性用品..."       // string
    },
    
    // 與情緒溫柔對話
    "emotion": {
        "emotion_event": "上週工作上的一個誤解...",  // string
        "emotion_name": "小灰",                    // string
        "unmet_needs": "需要更多的理解和支持..."    // string
    },
    
    // 你與身邊的連結
    "relations": {
        "family": "家人是我最重要的支柱...",        // string
        "friends": "朋友讓我的生活更豐富多彩...",   // string
        "love": "正在學習如何更好地愛自己..."       // string
    },
    
    // 工作與事業中的你
    "career": {
        "challenge": "最近負責一個跨部門的專案...",           // string
        "new_understanding": "發現自己比想像中更有耐心..."    // string
    },
    
    // 探索內心的渴望
    "desire": {
        "dream": "想要開一間結合咖啡和書店的小店...",  // string
        "goal": "三個月內完成商業計劃書..."           // string
    },
    
    // 回望與前行
    "reflection": {
        "forgiveness": "親愛的過去的自己...",         // string
        "future_self": "希望你能保持現在的熱情..."     // string
    },
    
    // 此刻的心情與標記
    "mood_and_tags": {
        "snapshot_title": "年末的反思時光",           // string
        "current_mood": "平靜",                      // string (enum: 平靜,開心,興奮,溫暖,焦慮但充滿希望,沮喪,其他)
        "current_thoughts": "感覺自己正在慢慢成長...", // string
        "personal_tags": "成長,反思,希望,平靜,感恩"    // string (comma-separated)
    },
    
    // 預約下一封時空信
    "schedule": {
        "reminder_period": "3 個月"                  // string (enum: 1 個月,3 個月,6 個月)
    },
    
    // 可選：快照圖片
    "snapshot_image": File,                          // File object (optional)
    
    // 系統資訊
    "created_at": "2024-12-15T10:30:00Z",           // ISO 8601 timestamp
    "user_id": "user123"                            // string (自動從認證 token 取得)
}
```

**回應**:
```javascript
{
    "success": true,
    "message": "問卷提交成功",
    "data": {
        "snapshot_id": "snapshot_123",
        "created_at": "2024-12-15T10:30:00Z",
        "reminder_scheduled": true,
        "reminder_date": "2025-03-15T10:30:00Z"
    }
}
```

### 2. 獲取用戶快照列表 (ReviewPage)
```javascript
import { apiRequest } from '../api/client';

const getUserSnapshots = async (options = {}) => {
    const queryParams = new URLSearchParams();
    if (options.limit) queryParams.append('limit', options.limit);
    if (options.offset) queryParams.append('offset', options.offset);
    if (options.sort) queryParams.append('sort', options.sort);
    
    return await apiRequest(`/snapshots${queryParams.toString() ? '?' + queryParams.toString() : ''}`, {
        method: 'GET'
    });
};
```

**端點**: `GET /snapshots`
**需要認證**: 是
**查詢參數**:
- `limit` (number, optional): 每頁返回的快照數量，預設 20
- `offset` (number, optional): 分頁偏移量，預設 0
- `sort` (string, optional): 排序方式，可選值：`created_at_desc`(預設), `created_at_asc`

**回應**:
```javascript
{
    "success": true,
    "data": {
        "snapshots": [
            {
                "id": "snapshot_123",
                "title": "年末的反思",                    // 從 snapshot_title 或 current_thoughts 自動生成
                "date": "2024-12-15T10:30:00Z",
                "mood": "平靜",
                "image_url": "https://storage.../image.jpg",  // 如果有上傳圖片
                "assigned_image": "/素材/平靜1.png",          // 根據心情隨機分配的預設圖片
                "content": "感覺自己正在慢慢成長...",        // 來自問卷的 current_thoughts 欄位
                "tags": ["成長", "反思", "平靜"]
            }
        ],
        "total": 15,
        "has_more": true,
        "next_offset": 20
    }
}
```

### 3. 獲取特定快照詳細資料 (CheckReviewPage)
```javascript
import { apiRequest } from '../api/client';

const getSnapshotDetail = async (snapshotId) => {
    return await apiRequest(`/snapshots/${snapshotId}`, {
        method: 'GET'
    });
};
```

**端點**: `GET /snapshots/{snapshot_id}`
**需要認證**: 是
**路徑參數**:
- `snapshot_id` (string): 快照的唯一識別碼

**回應**:
```javascript
{
    "success": true,
    "data": {
        "id": "snapshot_123",
        "created_at": "2024-12-15T10:30:00Z",
        "user_id": "user123",
        
        // 完整的問卷答案
        "questionnaire_data": {
            "satisfaction": {
                "rating": 7,
                "reason": "整體來說還算滿意..."
            },
            "gratitude": {
                "grateful_events": "1. 今天早上看到陽光...",
                "share_with": "我的家人和最好的朋友",
                "inspiration": "這些小事提醒我要珍惜當下..."
            },
            // ... 其他所有問卷資料
        },
        
        // 快照元資料
        "metadata": {
            "title": "年末的反思",                      // 來自 snapshot_title 或 current_thoughts 自動生成
            "mood": "平靜",                            // 來自 current_mood
            "tags": ["成長", "反思", "平靜"],           // 來自 personal_tags (逗號分隔轉陣列)
            "content": "感覺自己正在慢慢成長...",        // 來自 current_thoughts
            "image_url": "https://storage.../image.jpg",  // 用戶上傳的圖片
            "assigned_image": "/素材/平靜1.png",          // 根據心情隨機分配的預設圖片
            "reminder_period": "3 個月",
            "next_reminder": "2025-03-15T10:30:00Z"
        }
    }
}
```

### 4. 上傳快照圖片
```javascript
import { apiRequest } from '../api/client';

const uploadSnapshotImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    return await apiRequest('/snapshots/upload-image', {
        method: 'POST',
        headers: {}, // 不設定 Content-Type，讓瀏覽器自動設定 multipart/form-data
        body: formData
    });
};
```

**端點**: `POST /snapshots/upload-image`
**需要認證**: 是
**參數**: 
- `image` (File): 圖片檔案 (multipart/form-data)

**回應**:
```javascript
{
    "success": true,
    "data": {
        "image_url": "https://storage.../uploaded-image.jpg",
        "image_id": "img_123"
    }
}
```

### 5. 刪除快照
```javascript
import { apiRequest } from '../api/client';

const deleteSnapshot = async (snapshotId) => {
    return await apiRequest(`/snapshots/${snapshotId}`, {
        method: 'DELETE'
    });
};
```

**端點**: `DELETE /snapshots/{snapshot_id}`
**需要認證**: 是
**路徑參數**:
- `snapshot_id` (string): 快照的唯一識別碼

**回應**:
```javascript
{
    "success": true,
    "message": "快照已成功刪除"
}
```

### 6. 更新快照標題
```javascript
import { apiRequest } from '../api/client';

const updateSnapshotTitle = async (snapshotId, newTitle) => {
    return await apiRequest(`/snapshots/${snapshotId}/title`, {
        method: 'PUT',
        body: {
            title: newTitle
        }
    });
};
```

**端點**: `PUT /snapshots/{snapshot_id}/title`
**需要認證**: 是
**參數**:
```javascript
{
    "title": "新的快照標題"  // string (required, max length: 500)
}
```

**回應**:
```javascript
{
    "success": true,
    "message": "快照標題更新成功",
    "data": {
        "id": "snapshot_123",
        "title": "新的快照標題",
        "updated_at": "2024-12-15T10:30:00Z"
    }
}
```

### 7. 更新快照提醒設定
```javascript
import { apiRequest } from '../api/client';

const updateSnapshotReminder = async (snapshotId, reminderPeriod) => {
    return await apiRequest(`/snapshots/${snapshotId}/reminder`, {
        method: 'PUT',
        body: {
            reminder_period: reminderPeriod
        }
    });
};
```

**端點**: `PUT /snapshots/{snapshot_id}/reminder`
**需要認證**: 是
**參數**:
```javascript
{
    "reminder_period": "3 個月"  // string (enum: 1 個月,3 個月,6 個月)
}
```

**回應**:
```javascript
{
    "success": true,
    "data": {
        "next_reminder": "2025-03-15T10:30:00Z"
    }
}
```

## 資料庫結構建議

### snapshots 表
```sql
CREATE TABLE snapshots (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(500),
    questionnaire_data JSON NOT NULL,
    image_url VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    reminder_period VARCHAR(50),
    next_reminder TIMESTAMP,
    
    INDEX idx_user_created (user_id, created_at),
    INDEX idx_next_reminder (next_reminder),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### snapshot_tags 表 (如果需要標籤搜尋功能)
```sql
CREATE TABLE snapshot_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    snapshot_id VARCHAR(255) NOT NULL,
    tag VARCHAR(100) NOT NULL,
    
    INDEX idx_snapshot_tag (snapshot_id, tag),
    INDEX idx_tag (tag),
    FOREIGN KEY (snapshot_id) REFERENCES snapshots(id) ON DELETE CASCADE
);
```

## 常見問題

### Q: 為什麼註冊時會出現 "Column 'NAME' cannot be null" 錯誤？
A: 這是因為後端資料庫的 `NAME` 欄位不能為 null，但前端傳送的 `nickname` 欄位名稱不匹配。現在已經在 API 層自動處理這個對應關係。

### Q: 前端是否還需要使用 nickname 欄位？
A: 是的，前端仍然使用 `nickname` 欄位，API 層會自動將其轉換為後端期望的 `name` 欄位。

### Q: mailRegister 和 mailLogin 與一般註冊登入有什麼差別？
A: mailRegister 和 mailLogin 是專門為 Google OAuth 第三方登入設計的端點。主要差別：
- **一般註冊/登入**: 使用 email + password
- **Google 第三方**: 使用 email + googleId，不需要密碼
- **資料來源**: Google 第三方會從 Google 取得用戶基本資料（暱稱、頭像等）

### Q: 如何整合 Google OAuth？
A: 前端需要：
1. 設定 Google OAuth Client ID (環境變數 `VITE_GOOGLE_CLIENT_ID`)
2. 使用 Google OAuth 取得用戶資料
3. 將 Google 資料傳送到 mailRegister/mailLogin 端點
4. 詳細設定請參考 `GOOGLE_OAUTH_SETUP.md`

### Q: 問卷資料如何儲存？
A: 問卷資料以 JSON 格式儲存在 `snapshots` 表的 `questionnaire_data` 欄位中，這樣可以保持資料結構的彈性。

### Q: 圖片如何處理？
A: 圖片先上傳到雲端儲存服務（如 Google Cloud Storage），然後將 URL 儲存在資料庫中。建議實作圖片壓縮和格式轉換。

### Q: 提醒功能如何實作？
A: 可以使用定時任務（cron job）定期檢查 `next_reminder` 欄位，發送郵件提醒用戶填寫新的問卷。

### Q: ReviewPage 中的 content 欄位來自哪裡？
A: ReviewPage 中顯示的 `content` 欄位實際上來自問卷第9題的 `current_thoughts` 欄位。這是用戶在"關於現在的你，有什麼特別想記錄下來的想法或感受？"這個問題中填寫的內容。

### Q: 快照標題如何生成？
A: 快照標題有兩個來源：
1. **優先使用**: 用戶在第9題中填寫的 `snapshot_title`（"為這個快照取個名字吧"）
2. **自動生成**: 如果用戶沒有填寫標題，系統會從 `current_thoughts` 的前幾個字自動生成標題

