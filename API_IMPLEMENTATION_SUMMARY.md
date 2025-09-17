# API Implementation Summary

本文檔總結了根據 Swagger 規格 (https://checkpoint-backend-357565914560.asia-east1.run.app/swagger-ui/index.html) 實現的所有 API 端點。

## 📋 已實現的 API 端點

### 🔐 用戶認證 API (User APIs)

#### 1. 用戶註冊
- **端點**: `POST /user/register`
- **函數**: `registerUser({ email, password, name })`
- **請求體**: 
  ```json
  {
    "email": "string",
    "password": "string", 
    "name": "string"
  }
  ```
- **回應**: `{statusCode: string, data: {email: string, name: string}}`

#### 2. 用戶登入
- **端點**: `POST /user/login`
- **函數**: `loginUser({ email, password })`
- **請求體**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **回應**: `{statusCode: string, data: {email: string, name: string}}`

#### 3. Google 登入
- **端點**: `POST /user/mailLogin`
- **函數**: `mailLogin({ email, name, googleId })`
- **請求體**:
  ```json
  {
    "email": "string",
    "name": "string",
    "googleId": "string"
  }
  ```
- **回應**: `{statusCode: string, data: {email: string, name: string}}`

#### 4. 用戶登出
- **端點**: `POST /user/logout`
- **函數**: `logoutUser({ email, password })`
- **請求體**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **回應**: `{statusCode: string, data: string}`

#### 5. 忘記密碼
- **端點**: `POST /user/forgetPassword`
- **函數**: `forgetPassword(email)`
- **請求體**:
  ```json
  {
    "email": "string"
  }
  ```
- **回應**: `{statusCode: string, data: string}`

#### 6. 更改用戶名稱
- **端點**: `POST /user/change`
- **函數**: `changeName({ email, name })`
- **請求體**:
  ```json
  {
    "email": "string",
    "name": "string"
  }
  ```
- **回應**: `{statusCode: string, data: {email: string, name: string}}`

#### 7. 更改密碼
- **端點**: `POST /user/changePassword`
- **函數**: `changePassword({ email, currentPassword, newPassword })`
- **請求體**:
  ```json
  {
    "email": "string",
    "currentPassword": "string",
    "newPassword": "string"
  }
  ```
- **回應**: `{statusCode: string, data: string}`

### 📸 快照 API (Snapshot APIs)

#### 1. 獲取用戶快照列表
- **端點**: `GET /api/snapshots?email={email}`
- **函數**: `getUserSnapshots(email, options)`
- **查詢參數**: 
  - `email` (required): 用戶電子郵件
  - `limit` (optional): 限制數量
  - `offset` (optional): 偏移量
- **回應**: `{statusCode: string, data: string}`

#### 2. 獲取單個快照詳情
- **端點**: `GET /api/snapshots/{snapshot_id}`
- **函數**: `getSnapshotDetail(snapshotId)`
- **路徑參數**: `snapshot_id` (required)
- **回應**: `{statusCode: string, data: string}`

#### 3. 更新快照標題
- **端點**: `PUT /api/snapshots/{snapshot_id}/title`
- **函數**: `updateSnapshotTitle(snapshotId, newTitle)`
- **路徑參數**: `snapshot_id` (required)
- **請求體**:
  ```json
  {
    "title": "string"
  }
  ```
- **回應**: `{statusCode: string, data: string}`

#### 4. 更新快照提醒
- **端點**: `PUT /api/snapshots/{snapshot_id}/reminder`
- **函數**: `updateSnapshotReminder(snapshotId, reminderPeriod)`
- **路徑參數**: `snapshot_id` (required)
- **請求體**:
  ```json
  {
    "reminder_period": "string"
  }
  ```
- **回應**: `{statusCode: string, data: string}`

#### 5. 刪除快照
- **端點**: `DELETE /api/snapshots/{snapshot_id}`
- **函數**: `deleteSnapshot(snapshotId)`
- **路徑參數**: `snapshot_id` (required)
- **回應**: `{statusCode: string, data: string}`

### 📝 問卷 API (Questionnaire APIs)

#### 1. 提交問卷
- **端點**: `POST /api/questionnaire/submit`
- **函數**: `submitQuestionnaire(questionnairePayload)`
- **請求體**: 支援兩種格式
  - JSON 格式 (不含圖片):
    ```json
    {
      "email": "string",
      "mood": "string",
      "content": "string",
      "tags": ["string"]
    }
    ```
  - FormData 格式 (含圖片):
    - `data`: JSON Blob
    - `snapshot_image`: File
- **回應**: `{statusCode: string, data: string}`

## 📁 檔案結構

```
src/api/
├── client.js              # 基礎 API 客戶端
├── auth.js                # 用戶認證相關 API
├── snapshots.js           # 快照相關 API
├── questionnaire.js       # 問卷相關 API
└── accountValidation.js   # 帳號驗證工具 (輔助功能)
```

## 🔧 使用方式

### 1. 導入 API 函數
```javascript
import { registerUser, loginUser } from './src/api/auth.js';
import { getUserSnapshots } from './src/api/snapshots.js';
import { submitQuestionnaire } from './src/api/questionnaire.js';
```

### 2. 調用 API
```javascript
// 用戶註冊
const registerResult = await registerUser({
  email: 'user@example.com',
  password: 'password123',
  name: 'User Name'
});

// 獲取快照
const snapshots = await getUserSnapshots('user@example.com');

// 提交問卷
const questionnaireResult = await submitQuestionnaire({
  email: 'user@example.com',
  mood: 'happy',
  content: 'Today was a good day!'
});
```

## ✅ 完成狀態

- ✅ 用戶認證 API (7/7 個端點)
- ✅ 快照 API (5/5 個端點)
- ✅ 問卷 API (1/1 個端點)
- ✅ API 文檔和註釋
- ✅ 錯誤處理和型別註釋

## 🧪 測試

使用 `tmp_rovodev_api_test.js` 檔案可以測試所有 API 端點:

```javascript
import { runAllTests } from './tmp_rovodev_api_test.js';
await runAllTests();
```

## 📝 注意事項

1. 所有 API 端點都按照 Swagger 規格實現
2. 包含完整的 JSDoc 註釋和型別定義
3. 統一的錯誤處理機制
4. 支援 FormData 和 JSON 兩種請求格式
5. 自動處理認證 token 和請求標頭

## 🔗 相關連結

- [Swagger UI](https://checkpoint-backend-357565914560.asia-east1.run.app/swagger-ui/index.html)
- [API 規格文檔](https://checkpoint-backend-357565914560.asia-east1.run.app/v3/api-docs)