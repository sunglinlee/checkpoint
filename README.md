# 人生快照 (Life Snapshot)

一個與自己獨處的溫柔空間，用來傾聽、整理，並看見自己的成長。

## 專案特色

- 🎵 **輕音樂播放**：使用 Tone.js 提供舒緩的背景音樂
- 📱 **響應式設計**：完美適配桌面和行動裝置
- 🎨 **現代化 UI**：使用 Tailwind CSS 打造美觀的介面
- 🔄 **流暢導航**：單頁應用程式，提供流暢的使用體驗
- 📝 **完整問卷**：涵蓋生活各個面向的深度反思問題
- 🔐 **用戶認證**：支援 Google 第三方登入和傳統帳號密碼登入

## 技術棧

- **React 18** - 前端框架
- **Vite** - 建構工具
- **Tailwind CSS** - 樣式框架
- **Tone.js** - 音訊處理
- **@react-oauth/google** - Google OAuth 登入
- **jwt-decode** - JWT 解碼
- **Noto Sans TC** - 中文字體

## 快速開始

### 安裝依賴

```bash
npm install
```

### 設置 Google OAuth

1. 按照 `GOOGLE_OAUTH_SETUP.md` 中的說明設置 Google OAuth
2. 創建 `.env` 文件並添加您的 Google Client ID：

```bash
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
```

### 開發模式

```bash
npm run dev
```

應用程式將在 `http://localhost:3000` 啟動

### 建構生產版本

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

## 專案結構

```
src/
├── components/
│   ├── Icon.jsx              # 圖標組件
│   ├── icons.jsx             # 圖標集合
│   ├── HomePage.jsx          # 首頁組件
│   ├── LoginPage.jsx         # 登入頁面組件
│   ├── TransitionPage.jsx    # 過渡頁面組件
│   └── QuestionnairePage.jsx # 問卷頁面組件
├── App.jsx                   # 主要應用組件
├── main.jsx                  # 應用入口
└── index.css                 # 全域樣式
```

## 功能說明

### 首頁 (HomePage)
- 展示專案理念和特色
- 提供開始問卷的入口
- 包含登入和註冊按鈕
- 響應式設計，適配各種螢幕尺寸

### 登入頁面 (LoginPage)
- 支援 Google 第三方登入
- 傳統帳號密碼登入/註冊
- 可在登入和註冊模式間切換
- 與整體設計風格一致

### 過渡頁面 (TransitionPage)
- 提供音樂播放功能
- 引導使用者進入問卷前的準備
- 溫馨的提示和鼓勵

### 問卷頁面 (QuestionnairePage)
- 12個步驟的深度反思問卷
- 支援多種輸入類型：文字、多行文字、評分、圖片上傳、選項
- 進度條顯示完成狀態
- 可前後切換問題

## 問卷內容

問卷涵蓋以下主題：
1. 基本資訊
2. 生活滿意度
3. 感恩時刻
4. 關注焦點
5. 情緒對話
6. 人際關係
7. 工作挑戰
8. 內心渴望
9. 自我反思
10. 圖片記錄
11. 提醒設定
12. 完成總結

## 開發指南

### 新增問題類型

在 `QuestionnairePage.jsx` 中的 `questions` 陣列新增問題，支援以下類型：
- `text`: 單行文字輸入
- `textarea`: 多行文字輸入
- `scale`: 評分選擇 (1-10)
- `image`: 圖片上傳
- `options`: 選項選擇

### 自定義樣式

使用 Tailwind CSS 類別或修改 `src/index.css` 中的自定義樣式。


## 授權

MIT License

## 聯絡資訊

© 2024 人生快照 (Check Point). All Rights Reserved. 