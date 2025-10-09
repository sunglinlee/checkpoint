# 信箱驗證功能使用說明

## 📧 功能概述

本專案已成功整合信箱驗證功能，包含完整的前端架構和 API 介面。用戶可以通過點擊驗證連結來驗證他們的信箱，確保帳號安全性。

## 🏗️ 架構組成

### 1. API 層 (`src/api/emailVerification.js`)
- `verifyEmail(token, email)` - 驗證信箱
- `resendVerificationEmail(email)` - 重新發送驗證信
- `checkEmailVerificationStatus(email)` - 檢查驗證狀態
- `testEmailVerificationAPIs()` - 測試所有 API

### 2. 組件層
- **EmailVerificationPage** (`src/components/EmailVerificationPage.jsx`)
  - 處理驗證連結點擊後的驗證流程
  - 自動解析 URL 參數 (token, email, error)
  - 顯示驗證結果和錯誤處理
  - 提供重新發送驗證信功能

- **EmailVerificationStatus** (`src/components/EmailVerificationStatus.jsx`)
  - 可在其他頁面中顯示驗證狀態提醒
  - 自動檢查用戶驗證狀態
  - 提供重新發送和立即驗證選項

- **EmailVerificationTestPage** (`src/components/EmailVerificationTestPage.jsx`)
  - 測試頁面，用於開發和調試
  - 可測試 API、解析 URL、生成驗證連結

### 3. 工具函數 (`src/utils/emailVerificationHelper.js`)
- URL 參數解析和驗證
- 驗證連結生成
- 驗證狀態管理
- 錯誤處理和格式化

## 🚀 使用方式

### 1. 基本驗證流程

```javascript
// 用戶點擊驗證連結後，會自動導向到驗證頁面
// URL 格式: /verify-email?token={token}&email={email}

// EmailVerificationPage 會自動處理驗證流程
<EmailVerificationPage onNavigate={handleNavigate} />
```

### 2. 在其他頁面顯示驗證狀態

```javascript
// 在需要顯示驗證狀態的頁面中使用
<EmailVerificationStatus 
    user={user} 
    onVerificationComplete={() => {
        // 驗證完成後的處理邏輯
    }} 
/>
```

### 3. 手動 API 呼叫

```javascript
import { verifyEmail, resendVerificationEmail } from '../api/emailVerification';

// 驗證信箱
const result = await verifyEmail(token, email);

// 重新發送驗證信
const resendResult = await resendVerificationEmail(email);
```

## 🔗 URL 路由

### 驗證頁面路由
- **驗證成功**: `/verify-email?token={token}&email={email}`
- **驗證失敗**: `/verify-email?error=invalid_token&email={email}`
- **測試頁面**: `/?page=email-verification-test`

### 自動路由處理
App.jsx 會自動檢測 URL 中的驗證參數，並自動導向到對應的驗證頁面。

## 🧪 測試功能

### 測試頁面
訪問 `/?page=email-verification-test` 可以進入測試頁面，包含：

1. **API 測試** - 測試所有信箱驗證 API
2. **URL 解析測試** - 測試 URL 參數解析功能
3. **連結生成** - 生成測試用的驗證連結

### API 測試
```javascript
import { testEmailVerificationAPIs } from '../api/emailVerification';

// 在瀏覽器控制台中執行
testEmailVerificationAPIs().then(success => {
    console.log(success ? '所有 API 測試通過！' : '部分 API 測試失敗');
});
```

## 📋 後端 API 規格

### 1. 驗證信箱
```
POST /user/verify-email
Content-Type: application/json

{
    "token": "verification_token_123",
    "email": "user@example.com"
}
```

### 2. 重新發送驗證信
```
POST /user/resend-verification
Content-Type: application/json

{
    "email": "user@example.com"
}
```

### 3. 檢查驗證狀態
```
GET /user/email-verification-status?email=user@example.com
```

## 🔐 安全性考量

1. **Token 過期時間**: 建議設定 24 小時
2. **重新發送限制**: 建議每 5 分鐘最多發送一次
3. **錯誤處理**: 不洩露敏感資訊
4. **URL 驗證**: 自動驗證 URL 參數格式

## 📱 響應式設計

所有組件都支援響應式設計，在桌面和行動裝置上都能正常運作。

## 🎨 UI/UX 特色

- **載入狀態**: 驗證過程中顯示載入動畫
- **錯誤處理**: 用戶友好的錯誤訊息
- **成功動畫**: 驗證成功時的視覺回饋
- **重新發送**: 失敗時可重新發送驗證信
- **導航選項**: 驗證完成後可導向登入或首頁

## 🔧 開發注意事項

1. **環境變數**: 確保設定正確的 API 基底網址
2. **CORS**: 後端需要設定適當的 CORS 政策
3. **錯誤處理**: 所有 API 錯誤都會統一處理
4. **狀態管理**: 驗證狀態會自動快取到 localStorage

## 📞 支援

如有任何問題或需要協助，請參考 API_DOCUMENTATION.md 中的詳細說明。
