# 認證安全性修復：防止重複帳號問題

## 問題描述
目前系統存在安全漏洞：用戶可以使用相同的電子郵件地址進行一般註冊（email + password）和 Google OAuth 登入，這會導致：
1. 帳號重複或混淆
2. 安全性風險
3. 用戶體驗不一致

## 解決方案

### 前端修改

#### 1. 新增帳號驗證模組 (`src/api/accountValidation.js`)
- `checkAccountExists(email)`: 檢查帳號是否存在及認證方式
- `validateAuthMethod(email, authMethod)`: 驗證用戶是否可使用指定認證方式

#### 2. 更新認證函數 (`src/api/auth.js`)
在以下函數中加入驗證：
- `registerUser()`: 一般註冊前檢查
- `mailRegister()`: Google 註冊前檢查  
- `mailLogin()`: Google 登入前檢查

### 後端 API 需求

#### 新增端點：檢查帳號狀態
```
GET /user/checkAccount?email={email}
```

**回應格式：**
```json
{
  "statusCode": "0000",
  "exists": true,
  "authMethod": "regular", // "regular" | "google" | null
  "user": {
    "email": "user@example.com",
    "name": "用戶名稱",
    "hasPassword": true,
    "hasGoogleId": false
  }
}
```

**邏輯：**
1. 查詢資料庫中是否存在該 email
2. 檢查該用戶的認證方式：
   - 如果有 `password` 欄位且不為空 → `authMethod: "regular"`
   - 如果有 `googleId` 欄位且不為空 → `authMethod: "google"`
   - 如果都沒有 → `authMethod: null`

#### 更新現有端點邏輯

**`POST /user/register`**
- 檢查 email 是否已存在
- 如果存在且已有 Google 認證，返回錯誤

**`POST /user/mailLogin`**
- 檢查 email 是否已存在
- 如果存在且已有密碼認證，返回錯誤
- 如果不存在，自動建立 Google 帳號

## 用戶體驗流程

### 情境 1：一般註冊 → Google 登入
1. 用戶嘗試用 Google 登入
2. 系統檢測到該 email 已用一般方式註冊
3. 顯示錯誤：「此電子郵件已使用一般帳號密碼註冊，請使用一般帳號密碼登入，或使用其他電子郵件地址。」

### 情境 2：Google 註冊 → 一般登入
1. 用戶嘗試一般註冊
2. 系統檢測到該 email 已用 Google 註冊
3. 顯示錯誤：「此電子郵件已使用Google註冊，請使用Google登入，或使用其他電子郵件地址。」

### 情境 3：帳號綁定（可選功能）
未來可考慮實作帳號綁定功能，讓用戶可以：
1. 在已有一般帳號的情況下綁定 Google
2. 在已有 Google 帳號的情況下設定密碼

## 錯誤處理

### 前端錯誤顯示
錯誤訊息會顯示在登入頁面的錯誤區域：
```jsx
{errorMessage && (
  <div className="mb-4 p-3 rounded-md bg-red-50 text-red-600 text-sm">
    {errorMessage}
  </div>
)}
```

### 後端錯誤碼
建議新增專用錯誤碼：
- `1003`: 電子郵件已使用其他認證方式註冊
- `1004`: 認證方式不匹配

## 測試案例

### 測試 1：防止重複註冊
1. 使用 email A 進行一般註冊
2. 嘗試使用相同 email A 進行 Google 登入
3. 預期：顯示錯誤訊息，阻止登入

### 測試 2：正常 Google 流程
1. 使用 email B 進行 Google 登入（首次）
2. 系統自動建立 Google 帳號
3. 再次使用相同 email B 進行 Google 登入
4. 預期：正常登入

### 測試 3：正常一般流程
1. 使用 email C 進行一般註冊
2. 使用相同 email C 進行一般登入
3. 預期：正常登入

## 部署注意事項

1. **後端優先**：需要先部署後端的 `/user/checkAccount` 端點
2. **向後兼容**：如果後端端點不存在，前端會使用備用檢查方式
3. **資料庫遷移**：可能需要檢查現有資料中是否有重複帳號

## 安全性提升

此修復提升了以下安全性：
1. **防止帳號劫持**：避免他人用 Google 登入已存在的一般帳號
2. **資料一致性**：確保每個 email 只對應一種認證方式
3. **用戶體驗**：提供清晰的錯誤訊息指導用戶正確操作