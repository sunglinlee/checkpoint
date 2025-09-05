# 後端API實作規格：帳號檢查端點

## 新增端點：檢查帳號狀態

### 端點資訊
```
GET /user/checkAccount?email={email}
```

### 請求參數
| 參數名 | 類型 | 必填 | 說明 |
|--------|------|------|------|
| email | string | 是 | 要檢查的電子郵件地址 |

### 回應格式

#### 成功回應 (200 OK)
```json
{
  "statusCode": "0000",
  "message": "查詢成功",
  "exists": true,
  "authMethod": "regular",
  "user": {
    "email": "user@example.com",
    "name": "用戶名稱",
    "hasPassword": true,
    "hasGoogleId": false,
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

#### 帳號不存在
```json
{
  "statusCode": "0000",
  "message": "查詢成功",
  "exists": false,
  "authMethod": null,
  "user": null
}
```

#### 錯誤回應 (400 Bad Request)
```json
{
  "statusCode": "1005",
  "message": "無效的電子郵件格式",
  "exists": false,
  "authMethod": null,
  "user": null
}
```

### 回應欄位說明

| 欄位 | 類型 | 說明 |
|------|------|------|
| statusCode | string | 狀態碼 ("0000"=成功, 其他=錯誤) |
| message | string | 回應訊息 |
| exists | boolean | 帳號是否存在 |
| authMethod | string\|null | 認證方式："regular", "google", null |
| user | object\|null | 用戶基本資訊 (不包含敏感資料) |

### authMethod 判斷邏輯

```sql
-- 假設資料表結構
SELECT 
  email,
  name,
  password,
  google_id,
  avatar
FROM users 
WHERE email = ?
```

**判斷規則：**
1. `password` 不為空且不為null → `authMethod: "regular"`
2. `google_id` 不為空且不為null → `authMethod: "google"`
3. 兩者都有 → `authMethod: "regular"` (優先一般認證)
4. 兩者都沒有 → `authMethod: null`

## 實作範例

### Node.js + Express 範例

```javascript
// routes/user.js
const express = require('express');
const router = express.Router();

router.get('/checkAccount', async (req, res) => {
  try {
    const { email } = req.query;
    
    // 驗證email格式
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        statusCode: "1005",
        message: "無效的電子郵件格式",
        exists: false,
        authMethod: null,
        user: null
      });
    }
    
    // 查詢資料庫
    const user = await User.findOne({ 
      where: { email: email.toLowerCase() },
      attributes: ['email', 'name', 'password', 'google_id', 'avatar']
    });
    
    if (!user) {
      return res.json({
        statusCode: "0000",
        message: "查詢成功",
        exists: false,
        authMethod: null,
        user: null
      });
    }
    
    // 判斷認證方式
    let authMethod = null;
    if (user.password && user.password.trim() !== '') {
      authMethod = "regular";
    } else if (user.google_id && user.google_id.trim() !== '') {
      authMethod = "google";
    }
    
    // 回傳結果 (不包含敏感資料)
    res.json({
      statusCode: "0000",
      message: "查詢成功",
      exists: true,
      authMethod: authMethod,
      user: {
        email: user.email,
        name: user.name,
        hasPassword: !!(user.password && user.password.trim()),
        hasGoogleId: !!(user.google_id && user.google_id.trim()),
        avatar: user.avatar
      }
    });
    
  } catch (error) {
    console.error('checkAccount error:', error);
    res.status(500).json({
      statusCode: "9999",
      message: "伺服器錯誤",
      exists: false,
      authMethod: null,
      user: null
    });
  }
});

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports = router;
```

### Python + FastAPI 範例

```python
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, EmailStr
from typing import Optional
import re

router = APIRouter()

class CheckAccountResponse(BaseModel):
    statusCode: str
    message: str
    exists: bool
    authMethod: Optional[str]
    user: Optional[dict]

@router.get("/checkAccount", response_model=CheckAccountResponse)
async def check_account(email: EmailStr = Query(..., description="要檢查的電子郵件")):
    try:
        # 查詢資料庫
        user = await User.get_or_none(email=email.lower())
        
        if not user:
            return CheckAccountResponse(
                statusCode="0000",
                message="查詢成功",
                exists=False,
                authMethod=None,
                user=None
            )
        
        # 判斷認證方式
        auth_method = None
        if user.password and user.password.strip():
            auth_method = "regular"
        elif user.google_id and user.google_id.strip():
            auth_method = "google"
        
        return CheckAccountResponse(
            statusCode="0000",
            message="查詢成功",
            exists=True,
            authMethod=auth_method,
            user={
                "email": user.email,
                "name": user.name,
                "hasPassword": bool(user.password and user.password.strip()),
                "hasGoogleId": bool(user.google_id and user.google_id.strip()),
                "avatar": user.avatar
            }
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "statusCode": "9999",
                "message": "伺服器錯誤",
                "exists": False,
                "authMethod": None,
                "user": None
            }
        )
```

## 資料庫考量

### 建議索引
```sql
-- 為email欄位建立索引以提升查詢效能
CREATE INDEX idx_users_email ON users(email);
```

### 資料表結構建議
```sql
-- 確保資料表有必要欄位
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT;

-- 建議約束
ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE(email);
```

## 安全性考量

1. **不回傳敏感資料**：絕對不要回傳密碼hash或完整的google_id
2. **輸入驗證**：驗證email格式，防止SQL注入
3. **速率限制**：考慮對此端點加入速率限制
4. **日誌記錄**：記錄查詢行為以便監控

## 測試案例

### 測試1：一般帳號
```bash
curl "http://localhost:3000/api/user/checkAccount?email=regular@example.com"
# 預期: authMethod: "regular"
```

### 測試2：Google帳號
```bash
curl "http://localhost:3000/api/user/checkAccount?email=google@example.com"
# 預期: authMethod: "google"
```

### 測試3：不存在的帳號
```bash
curl "http://localhost:3000/api/user/checkAccount?email=notexist@example.com"
# 預期: exists: false
```

### 測試4：無效email
```bash
curl "http://localhost:3000/api/user/checkAccount?email=invalid-email"
# 預期: 400 錯誤
```

## 部署檢查清單

- [ ] 實作 `/user/checkAccount` 端點
- [ ] 加入email格式驗證
- [ ] 測試所有回應情境
- [ ] 確認不會洩漏敏感資料
- [ ] 加入適當的錯誤處理
- [ ] 建立資料庫索引
- [ ] 設定速率限制 (可選)
- [ ] 更新API文件