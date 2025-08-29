# 快照圖片欄位更新說明

## 概述
為 ReviewPage 中的每個歷史快照添加了一個新的 `assigned_image` 欄位，用於儲存資料庫中隨機分配的圖片。

## 主要更改

### 1. API 文檔更新 (`API_DOCUMENTATION.md`)

#### 新增欄位說明
- 在快照列表 API 回應中添加了 `assigned_image` 欄位
- 在快照詳細資料 API 回應中添加了 `assigned_image` 欄位
- 添加了完整的圖片分配邏輯說明

#### 圖片分配邏輯
- **心情與圖片對應關係**：每種心情對應 3 張圖片
- **分配規則**：
  1. 系統為每個用戶維護圖片使用記錄
  2. 優先選擇該心情下未使用的圖片
  3. 如果所有圖片都已使用，重置記錄並重新隨機分配
  4. 圖片路徑格式：`/素材/{圖片檔名}`

### 2. 新增工具函數 (`src/utils/imageAssignment.js`)

#### 主要功能
- `MOOD_IMAGE_MAP`：定義心情與圖片的對應關係
- `assignImageByMood()`：根據心情分配圖片的邏輯函數
- `getSnapshotDisplayImage()`：獲取快照顯示圖片的工具函數

#### 圖片優先級
1. 用戶上傳的圖片 (`image_url`)
2. 系統分配的預設圖片 (`assigned_image`)
3. 心情預設圖片（備用）

### 3. ReviewPage 組件更新 (`src/components/ReviewPage.jsx`)

#### 移除的功能
- 移除了前端的圖片分配邏輯
- 移除了 `usedImages` 狀態管理
- 移除了 `assignImageByMood` 和 `getImageByMood` 函數

#### 新增的功能
- 導入 `getSnapshotDisplayImage` 工具函數
- 更新模擬數據，為每個快照添加 `assigned_image` 欄位
- 更新圖片顯示邏輯，使用新的工具函數

#### 更新的地方
- 快照卡片中的圖片顯示
- 快照詳細檢視彈出視窗中的圖片顯示

## 資料庫結構建議

### 新增欄位
```sql
-- 在 snapshots 表中添加新欄位
ALTER TABLE snapshots ADD COLUMN assigned_image VARCHAR(255);

-- 為現有記錄分配圖片的範例
UPDATE snapshots 
SET assigned_image = CASE 
  WHEN mood = '平靜' THEN '/素材/平靜1.png'
  WHEN mood = '開心' THEN '/素材/開心1.jpg'
  WHEN mood = '興奮' THEN '/素材/興奮1.jpg'
  WHEN mood = '溫暖' THEN '/素材/溫暖1.jpg'
  WHEN mood = '焦慮但充滿希望' THEN '/素材/焦慮但充滿希望1.jpg'
  WHEN mood = '沮喪' THEN '/素材/沮喪1.jpg'
  ELSE '/素材/平靜1.png'
END
WHERE assigned_image IS NULL;
```

### 用戶圖片使用記錄表
```sql
-- 建議新增表來追蹤用戶的圖片使用記錄
CREATE TABLE user_image_usage (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  mood VARCHAR(50) NOT NULL,
  used_images TEXT[], -- PostgreSQL 陣列，或用 JSON 格式
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 後端實作建議

### 問卷提交時的圖片分配
```javascript
// 在問卷提交 API 中
const assignImageForSnapshot = async (userId, mood) => {
  // 1. 獲取用戶的圖片使用記錄
  const usageRecord = await getUserImageUsage(userId, mood);
  
  // 2. 使用 assignImageByMood 邏輯分配圖片
  const assignedImage = assignImageByMood(mood, usageRecord);
  
  // 3. 更新用戶的圖片使用記錄
  await updateUserImageUsage(userId, mood, assignedImage);
  
  return assignedImage;
};
```

## 測試確認

✅ 開發服務器正常啟動 (http://localhost:3000)
✅ API 文檔已更新
✅ 工具函數已創建
✅ ReviewPage 組件已更新
✅ 模擬數據包含 assigned_image 欄位

## 下一步

1. **後端實作**：在後端 API 中實作圖片分配邏輯
2. **資料庫遷移**：執行資料庫結構更新
3. **測試**：確保前後端整合正常運作
4. **部署**：將更改部署到生產環境

## 注意事項

- 確保 `/素材/` 目錄下的圖片檔案存在且可訪問
- 圖片分配邏輯需要在後端實作，前端只負責顯示
- 考慮圖片載入失敗的錯誤處理機制