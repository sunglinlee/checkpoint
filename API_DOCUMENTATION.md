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

### 2. 信箱註冊
```javascript
import { mailRegister } from '../api/auth';

const result = await mailRegister({
    nickname: '用戶暱稱',  // 前端使用 nickname
    email: 'user@example.com',
    password: 'password123'
});
```

**端點**: `POST /user/mailRegister`
**參數**: 與一般註冊相同

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

### 4. 信箱登入
```javascript
import { mailLogin } from '../api/auth';

const result = await mailLogin({
    email: 'user@example.com',
    password: 'password123'
});
```

**端點**: `POST /user/mailLogin`
**參數**: 與一般登入相同

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

## 常見問題

### Q: 為什麼註冊時會出現 "Column 'NAME' cannot be null" 錯誤？
A: 這是因為後端資料庫的 `NAME` 欄位不能為 null，但前端傳送的 `nickname` 欄位名稱不匹配。現在已經在 API 層自動處理這個對應關係。

### Q: 前端是否還需要使用 nickname 欄位？
A: 是的，前端仍然使用 `nickname` 欄位，API 層會自動將其轉換為後端期望的 `name` 欄位。

