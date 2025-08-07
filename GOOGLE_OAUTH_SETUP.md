# Google OAuth 設置指南

## 步驟 1: 創建 Google Cloud Project

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 創建新項目或選擇現有項目
3. 啟用 Google+ API 和 Google Identity API

## 步驟 2: 配置 OAuth 2.0 憑證

1. 在 Google Cloud Console 中，前往「API 和服務」>「憑證」
2. 點擊「建立憑證」>「OAuth 2.0 用戶端 ID」
3. 選擇應用程式類型：
   - 如果是開發環境：選擇「網頁應用程式」
   - 如果是生產環境：選擇「網頁應用程式」

## 步驟 3: 設置授權的 JavaScript 來源

在 OAuth 2.0 用戶端設定中，添加以下授權的 JavaScript 來源：

### 開發環境：
```
http://localhost:5173
http://localhost:3000
```

### 生產環境：
```
https://yourdomain.com
```

## 步驟 4: 設置授權的重新導向 URI

添加以下授權的重新導向 URI：

### 開發環境：
```
http://localhost:5173
http://localhost:3000
```

### 生產環境：
```
https://yourdomain.com
```

## 步驟 5: 獲取 Client ID

1. 創建完成後，您會獲得一個 Client ID
2. 複製這個 Client ID

## 步驟 6: 更新應用程式代碼

在 `src/App.jsx` 文件中，將 `YOUR_GOOGLE_CLIENT_ID` 替換為您的實際 Client ID：

```jsx
<GoogleOAuthProvider clientId="your-actual-client-id-here">
```

## 步驟 7: 測試

1. 啟動開發服務器：`npm run dev`
2. 點擊首頁右上角的「登入」或「註冊」按鈕
3. 測試 Google 登入功能

## 注意事項

- 請確保您的 Google Cloud Project 已啟用計費（如果需要）
- 在生產環境中，請使用 HTTPS
- 定期檢查和更新 OAuth 憑證
- 遵循 Google 的隱私權政策和服務條款

## 故障排除

如果遇到問題：

1. 檢查瀏覽器控制台是否有錯誤訊息
2. 確認 Client ID 是否正確
3. 檢查授權的 JavaScript 來源是否包含您的域名
4. 確認 Google+ API 和 Google Identity API 已啟用

## 安全建議

- 不要在客戶端代碼中暴露敏感信息
- 使用環境變數來存儲 Client ID
- 定期更新依賴包
- 實施適當的錯誤處理 