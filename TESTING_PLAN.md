# 認證安全性修復測試計劃

## 測試目標
驗證系統能正確防止用戶使用相同email進行不同認證方式的註冊/登入

## 測試環境準備

### 1. 後端準備
- [ ] 實作 `/user/checkAccount` API端點
- [ ] 執行資料庫遷移腳本
- [ ] 確認現有API正常運作

### 2. 前端準備  
- [ ] 確認新的驗證邏輯已部署
- [ ] 清除瀏覽器快取和localStorage
- [ ] 準備測試用的email帳號

## 測試案例

### 🧪 測試組1：API端點驗證

#### 測試1.1：checkAccount API - 不存在的帳號
```bash
# 請求
GET /user/checkAccount?email=notexist@example.com

# 預期回應
{
  "statusCode": "0000",
  "exists": false,
  "authMethod": null,
  "user": null
}
```

#### 測試1.2：checkAccount API - 一般認證帳號
```bash
# 前置：先建立一般帳號
POST /user/register
{
  "name": "測試用戶",
  "email": "regular@test.com", 
  "password": "password123"
}

# 請求
GET /user/checkAccount?email=regular@test.com

# 預期回應
{
  "statusCode": "0000",
  "exists": true,
  "authMethod": "regular",
  "user": {
    "email": "regular@test.com",
    "name": "測試用戶",
    "hasPassword": true,
    "hasGoogleId": false
  }
}
```

#### 測試1.3：checkAccount API - Google認證帳號
```bash
# 前置：先建立Google帳號
POST /user/mailLogin
{
  "email": "google@test.com",
  "googleId": "google123",
  "name": "Google用戶"
}

# 請求  
GET /user/checkAccount?email=google@test.com

# 預期回應
{
  "statusCode": "0000", 
  "exists": true,
  "authMethod": "google",
  "user": {
    "email": "google@test.com",
    "name": "Google用戶", 
    "hasPassword": false,
    "hasGoogleId": true
  }
}
```

### 🧪 測試組2：前端驗證邏輯

#### 測試2.1：防止一般註冊 → Google登入
**步驟：**
1. 使用email `conflict1@test.com` 進行一般註冊
2. 嘗試使用相同email進行Google登入

**預期結果：**
- 一般註冊成功
- Google登入被阻止，顯示錯誤：「此電子郵件已使用一般帳號密碼註冊，請使用一般帳號密碼登入，或使用其他電子郵件地址。」

#### 測試2.2：防止Google註冊 → 一般登入  
**步驟：**
1. 使用email `conflict2@test.com` 進行Google登入（自動註冊）
2. 嘗試使用相同email進行一般註冊

**預期結果：**
- Google登入成功
- 一般註冊被阻止，顯示錯誤：「此電子郵件已使用Google註冊，請使用Google登入，或使用其他電子郵件地址。」

#### 測試2.3：正常一般認證流程
**步驟：**
1. 使用email `normal1@test.com` 進行一般註冊
2. 登出
3. 使用相同email進行一般登入

**預期結果：**
- 註冊成功
- 登入成功

#### 測試2.4：正常Google認證流程
**步驟：**
1. 使用email `normal2@test.com` 進行Google登入
2. 登出  
3. 再次使用相同email進行Google登入

**預期結果：**
- 首次登入成功（自動註冊）
- 第二次登入成功

### 🧪 測試組3：邊界情況測試

#### 測試3.1：無效email格式
```bash
GET /user/checkAccount?email=invalid-email
# 預期：400錯誤
```

#### 測試3.2：空email參數
```bash  
GET /user/checkAccount?email=
# 預期：400錯誤
```

#### 測試3.3：後端API不存在時的備用機制
**步驟：**
1. 暫時關閉 `/user/checkAccount` 端點
2. 嘗試進行註冊/登入

**預期結果：**
- 前端使用備用檢查方式
- 不會因為API不存在而完全失效

### 🧪 測試組4：用戶體驗測試

#### 測試4.1：錯誤訊息顯示
**驗證項目：**
- [ ] 錯誤訊息清楚易懂
- [ ] 錯誤訊息提供解決方案
- [ ] 錯誤訊息樣式正確

#### 測試4.2：載入狀態
**驗證項目：**
- [ ] 驗證期間顯示載入狀態
- [ ] 按鈕正確禁用
- [ ] 不會重複提交

#### 測試4.3：多語言支援（如適用）
**驗證項目：**
- [ ] 錯誤訊息支援繁體中文
- [ ] 訊息格式一致

## 效能測試

### 測試5.1：API回應時間
**目標：** checkAccount API回應時間 < 200ms
**方法：** 使用工具測試100次請求的平均回應時間

### 測試5.2：併發請求
**目標：** 同時處理多個checkAccount請求
**方法：** 模擬10個併發請求，確認都能正確回應

## 安全性測試

### 測試6.1：敏感資料洩漏
**驗證：** checkAccount API不會回傳密碼hash或完整googleId

### 測試6.2：SQL注入防護
**測試：** 
```bash
GET /user/checkAccount?email=test@example.com'; DROP TABLE users; --
# 預期：安全處理，不會執行惡意SQL
```

## 回歸測試

### 測試7.1：現有功能不受影響
**驗證項目：**
- [ ] 正常一般註冊/登入流程
- [ ] 正常Google註冊/登入流程  
- [ ] 密碼修改功能
- [ ] 暱稱修改功能
- [ ] Token刷新功能

## 測試執行記錄

### 執行環境
- **日期：** ___________
- **執行者：** ___________
- **前端版本：** ___________
- **後端版本：** ___________

### 測試結果記錄表

| 測試案例 | 狀態 | 備註 |
|---------|------|------|
| 測試1.1 | ⬜ 通過 ⬜ 失敗 | |
| 測試1.2 | ⬜ 通過 ⬜ 失敗 | |
| 測試1.3 | ⬜ 通過 ⬜ 失敗 | |
| 測試2.1 | ⬜ 通過 ⬜ 失敗 | |
| 測試2.2 | ⬜ 通過 ⬜ 失敗 | |
| 測試2.3 | ⬜ 通過 ⬜ 失敗 | |
| 測試2.4 | ⬜ 通過 ⬜ 失敗 | |
| 測試3.1 | ⬜ 通過 ⬜ 失敗 | |
| 測試3.2 | ⬜ 通過 ⬜ 失敗 | |
| 測試3.3 | ⬜ 通過 ⬜ 失敗 | |
| 測試4.1 | ⬜ 通過 ⬜ 失敗 | |
| 測試4.2 | ⬜ 通過 ⬜ 失敗 | |
| 測試4.3 | ⬜ 通過 ⬜ 失敗 | |
| 測試5.1 | ⬜ 通過 ⬜ 失敗 | 平均回應時間: ___ms |
| 測試5.2 | ⬜ 通過 ⬜ 失敗 | |
| 測試6.1 | ⬜ 通過 ⬜ 失敗 | |
| 測試6.2 | ⬜ 通過 ⬜ 失敗 | |
| 測試7.1 | ⬜ 通過 ⬜ 失敗 | |

### 問題記錄
| 問題描述 | 嚴重程度 | 狀態 | 負責人 |
|---------|---------|------|--------|
| | | | |

## 測試工具建議

### API測試
- **Postman** - API端點測試
- **curl** - 命令列測試
- **Jest + Supertest** - 自動化API測試

### 前端測試  
- **Cypress** - E2E測試
- **Jest + React Testing Library** - 單元測試
- **Chrome DevTools** - 手動測試

### 效能測試
- **Apache Bench (ab)** - 簡單負載測試
- **Artillery** - 進階負載測試

## 測試完成標準

✅ **所有測試案例通過率 ≥ 95%**
✅ **無嚴重安全性問題**  
✅ **API回應時間符合要求**
✅ **現有功能無回歸問題**
✅ **用戶體驗良好**