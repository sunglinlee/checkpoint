## 後端 API 路徑總表（依檔案分類）

以下彙整專案中實際呼叫到的後端 API 路徑，並標註所在檔案與對應方法/函式。

---

### src/api/client.js
- **Base URL 決策**: `API_BASE_URL`
  - 開發環境: `'/api'`
  - 正式/其他環境: `'https://checkpoint-backend-357565914560.asia-east1.run.app'`（或以 `VITE_API_BASE_URL` 覆寫）
- **通用請求方法**: `apiRequest(path, options)`

---

### src/api/auth.js
- `POST /user/register` — 函式: `registerUser`
- `POST /user/mailRegister` — 函式: `mailRegister`
- `POST /user/login` — 函式: `loginUser`
- `POST /user/mailLogin` — 函式: `mailLogin`
- `POST /user/logout` — 函式: `logoutUser`
- `GET /user/refreshToken?email={email}` — 函式: `refreshToken`
- `POST /user/changePassword` — 函式: `changePassword`
- `POST /user/forgetPassword` — 函式: `forgetPassword`
- 嘗試多端點更新暱稱 — 函式: `updateNickname`
  - `POST /user/change`
  - `PUT /user/change`
  - `PATCH /user/change`
  - `POST /user/changeName`
  - `PUT /user/changeName`

---

### src/api/accountValidation.js
- `GET /user/checkAccount?email={email}` — 函式: `checkAccountExists`

---

### src/api/questionnaire.js
- `POST /questionnaire/submit` — 函式: `submitQuestionnaire`
  - 傳送 JSON 或 `multipart/form-data`（含 `snapshot_image`）

---

### src/api/snapshots.js
注意：此檔案依執行環境決定前綴路徑。
- 開發環境: `'/api/snapshots'`
- 正式/其他環境: `'/snapshots'`

實際端點（以下以 `{base}` 表示上述前綴）：
- `GET {base}?email={email}&limit={limit}&offset={offset}` — 函式: `getUserSnapshots`
- `GET {base}/{id}` — 函式: `getSnapshotDetail`
- `PUT {base}/{id}/title` — 函式: `updateSnapshotTitle`
- `PUT {base}/{id}/reminder` — 函式: `updateSnapshotReminder`
- `DELETE {base}/{id}` — 函式: `deleteSnapshot`

---

## 備註
- 實際請求會以 `src/api/client.js` 的 `API_BASE_URL` 為前綴組成，例如開發環境為 `'/api'`，正式環境可由 `VITE_API_BASE_URL` 或預設雲端網址決定。
- `API_DOCUMENTATION.md` 內可能出現的其他端點（如 `/snapshots/upload-image` 等）目前未在程式碼中實際呼叫，故未列入上述清單。


