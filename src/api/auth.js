import { apiRequest } from './client';
import { validateAuthMethod } from './accountValidation';

// 單例計時器：確保全域僅有一個 refresh 排程
let refreshTimerId = null;
const THIRTY_MINUTES_MS = 30 * 60 * 1000;

/**
 * 啟動 Token 自動刷新排程（每 30 分鐘執行一次）。
 * 僅在有登入使用者時啟動，且避免重複啟動。
 */
export function startTokenRefresh(email) {
    if (typeof window === 'undefined') return;
    if (!email) return; // 沒有 email 視為未登入
    if (refreshTimerId) return; // 已啟動則略過

    const runRefresh = async () => {
        try {
            const result = await refreshToken(email);
            // 後端只回傳成功訊息字串，不回傳新的 token
            // 這裡可以記錄刷新成功的日誌
            console.log('Token refresh result:', result);
            
            // 由於後端不回傳新 token，我們保持現有的認證狀態
            // 後端會在 cache 中延長 token 的有效期
        } catch (error) {
            // 若刷新失敗（例如 401），可視需求清除登入
            if (error?.status === 401 || error?.status === 403) {
                clearAuth();
                stopTokenRefresh();
            }
            // 其他錯誤暫不打斷排程
            console.error('Token refresh failed:', error);
        }
    };

    // 先等滿 30 分鐘再刷新；若希望登入後就立即延長，可先執行一次 runRefresh()
    refreshTimerId = window.setInterval(runRefresh, THIRTY_MINUTES_MS);
}

/** 停止 Token 自動刷新排程 */
export function stopTokenRefresh() {
    if (typeof window === 'undefined') return;
    if (refreshTimerId) {
        window.clearInterval(refreshTimerId);
        refreshTimerId = null;
    }
}

/**
 * User Registration - 用戶註冊
 * @param {Object} userData - User registration data
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @param {string} userData.name - User name
 * @returns {Promise<{statusCode: string, data: {email: string, name: string}}>}
 */
export async function registerUser({ name, nickname, email, password }) {
    // Use name if provided, otherwise use nickname
    const userName = name || nickname;
    
    // 檢查帳號是否已存在且使用不同認證方式
    const validation = await validateAuthMethod(email, 'regular');
    if (!validation.allowed) {
        throw new Error(validation.reason);
    }
    
    // 一般註冊 API - 按照 Swagger 規格
    return apiRequest('/user/register', {
        method: 'POST',
        body: { name: userName, email, password }
    });
}

export async function mailRegister({ nickname, email, googleId, avatar }) {
    // 檢查帳號是否已存在且使用不同認證方式
    const validation = await validateAuthMethod(email, 'google');
    if (!validation.allowed) {
        throw new Error(validation.reason);
    }
    
    // Google 第三方註冊 API - 直接傳入 Google 基本資料
    return apiRequest('/user/mailRegister', {
        method: 'POST',
        body: {
            name: nickname, // 後端期望 name 欄位
            email,
            googleId,
            avatar
        }
    });
}

/**
 * User Login - 用戶登入
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise<{statusCode: string, data: {email: string, name: string}}>}
 */
export async function loginUser({ email, password }) {
    // 一般登入 API - 按照 Swagger 規格
    return apiRequest('/user/login', {
        method: 'POST',
        body: { email, password }
    });
}

/**
 * Google OAuth Login - Google 登入
 * @param {Object} googleData - Google login data
 * @param {string} googleData.email - User email
 * @param {string} googleData.name - User name
 * @param {string} googleData.googleId - Google ID
 * @returns {Promise<{statusCode: string, data: {email: string, name: string}}>}
 */
export async function mailLogin({ email, googleId, name, avatar }) {
    // 檢查帳號是否已存在且使用不同認證方式
    const validation = await validateAuthMethod(email, 'google');
    if (!validation.allowed) {
        throw new Error(validation.reason);
    }
    
    // Google 第三方登入（若無帳號則自動建立）- 按照 Swagger 規格
    return apiRequest('/user/mailLogin', {
        method: 'POST',
        body: {
            email,
            googleId,
            name
        }
    });
}

/**
 * User Logout - 用戶登出
 * @param {Object} userInfo - User information for logout
 * @param {string} userInfo.email - User email
 * @param {string} userInfo.password - User password
 * @returns {Promise<{statusCode: string, data: string}>}
 */
export async function logoutUser({ email, password }) {
    // 登出 API - 按照 Swagger 規格
    return apiRequest('/user/logout', {
        method: 'POST',
        body: { email, password }
    });
}

export async function refreshToken(email) {
    // 刷新 token API
    return apiRequest(`/user/refreshToken?email=${encodeURIComponent(email)}`, {
        method: 'GET'
    });
}

/**
 * Change User Name - 更改用戶名稱
 * @param {Object} changeData - Name change data
 * @param {string} changeData.email - User email
 * @param {string} changeData.name - New name
 * @returns {Promise<{statusCode: string, data: {email: string, name: string}}>}
 */
export async function changeName({ email, name }) {
    // 更改名稱 API - 按照 Swagger 規格
    return apiRequest('/user/change', {
        method: 'POST',
        body: { email, name }
    });
}

/**
 * Change User Password - 更改密碼
 * @param {Object} passwordData - Password change data
 * @param {string} passwordData.email - User email
 * @param {string} passwordData.currentPassword - Current password
 * @param {string} passwordData.newPassword - New password
 * @returns {Promise<{statusCode: string, data: string}>}
 */
export async function changePassword({ email, currentPassword, newPassword }) {
    // 密碼修改 API - 按照 Swagger 規格
    return apiRequest('/user/changePassword', {
        method: 'POST',
        body: { email, currentPassword, newPassword }
    });
}

/**
 * Forgot Password - 忘記密碼
 * @param {string} email - User email
 * @returns {Promise<{statusCode: string, data: string}>}
 */
export async function forgetPassword(email) {
    // 忘記密碼 API - 按照 Swagger 規格
    return apiRequest('/user/forgetPassword', {
        method: 'POST',
        body: { email }
    });
}

export async function updateNickname({ email, nickname }) {
    // 暱稱修改 API
    console.log('嘗試暱稱修改 API 呼叫:', { email, name: nickname });
    
    const endpoints = [
        { method: 'POST', path: '/user/change' },
        { method: 'PUT', path: '/user/change' },
        { method: 'PATCH', path: '/user/change' },
        { method: 'POST', path: '/user/changeName' },
        { method: 'PUT', path: '/user/changeName' }
    ];
    
    let lastError = null;
    
    for (const endpoint of endpoints) {
        try {
            console.log(`嘗試 ${endpoint.method} ${endpoint.path}`);
            const response = await apiRequest(endpoint.path, {
                method: endpoint.method,
                body: { email, name: nickname }
            });
            console.log(`✅ 成功使用 ${endpoint.method} ${endpoint.path}`);
            return response;
        } catch (error) {
            console.log(`❌ ${endpoint.method} ${endpoint.path} 失敗:`, error.status, error.message);
            lastError = error;
            
            // 如果不是 404 或 405 (Method Not Allowed)，直接拋出錯誤
            if (error.status !== 404 && error.status !== 405) {
                throw error;
            }
        }
    }
    
    // 所有端點都失敗了
    console.error('所有端點都失敗了，最後的錯誤:', lastError);
    throw lastError;
}

export function persistAuth(token, user) {
    if (typeof window === 'undefined') return;
    if (token) window.localStorage.setItem('authToken', token);
    if (user) window.localStorage.setItem('authUser', JSON.stringify(user));
}

export function clearAuth() {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem('authToken');
    window.localStorage.removeItem('authUser');
}

export function loadAuth() {
    if (typeof window === 'undefined') return { token: null, user: null };
    const token = window.localStorage.getItem('authToken');
    const userRaw = window.localStorage.getItem('authUser');
    let user = null;
    try { user = userRaw ? JSON.parse(userRaw) : null; } catch {}
    return { token, user };
}

// 測試所有 API 端點的函數
export async function testAllAPIs() {
    console.log('開始測試所有 API 端點...');
    
    try {
        // 測試一般註冊
        console.log('測試一般註冊...');
        const registerResult = await registerUser({
            nickname: 'test_user',
            email: 'test@example.com',
            password: 'testpassword123'
        });
        console.log('一般註冊結果:', registerResult);
        
        // 測試信箱註冊
        console.log('測試信箱註冊...');
        const mailRegisterResult = await mailRegister({
            nickname: 'mail_user',
            email: 'mail@example.com',
            password: 'mailpassword123'
        });
        console.log('信箱註冊結果:', mailRegisterResult);
        
        // 測試一般登入
        console.log('測試一般登入...');
        const loginResult = await loginUser({
            email: 'test@example.com',
            password: 'testpassword123'
        });
        console.log('一般登入結果:', loginResult);
        
        // 測試信箱登入
        console.log('測試信箱登入...');
        const mailLoginResult = await mailLogin({
            email: 'mail@example.com',
            password: 'mailpassword123'
        });
        console.log('信箱登入結果:', mailLoginResult);
        
        // 測試刷新 token
        console.log('測試刷新 token...');
        const refreshResult = await refreshToken('test@example.com');
        console.log('刷新 token 結果:', refreshResult); // 後端回傳: "Token refreshed successfully"
        
        // 測試登出
        console.log('測試登出...');
        const logoutResult = await logoutUser({
            email: 'test@example.com',
            password: 'testpassword123'
        });
        console.log('登出結果:', logoutResult);
        
        console.log('所有 API 測試完成！');
        return true;
    } catch (error) {
        console.error('API 測試失敗:', error);
        return false;
    }
}


