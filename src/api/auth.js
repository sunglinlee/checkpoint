import { apiRequest } from './client';

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
            const newToken = result?.token || result?.accessToken || result?.data?.token;
            const userRaw = window.localStorage.getItem('authUser');
            const user = userRaw ? JSON.parse(userRaw) : null;
            if (newToken) {
                persistAuth(newToken, user);
            }
        } catch (error) {
            // 若刷新失敗（例如 401），可視需求清除登入
            if (error?.status === 401 || error?.status === 403) {
                clearAuth();
                stopTokenRefresh();
            }
            // 其他錯誤暫不打斷排程
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

export async function registerUser({ nickname, email, password }) {
    // 一般註冊 API - 將 nickname 對應到後端的 name 欄位
    return apiRequest('/user/register', {
        method: 'POST',
        body: { name: nickname, email, password }
    });
}

export async function mailRegister({ nickname, email, googleId, avatar }) {
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

export async function loginUser({ email, password }) {
    // 一般登入 API
    return apiRequest('/user/login', {
        method: 'POST',
        body: { email, password }
    });
}

export async function mailLogin({ email, googleId, name, avatar }) {
    // Google 第三方登入（若無帳號則自動建立）
    return apiRequest('/user/mailLogin', {
        method: 'POST',
        body: {
            email,
            googleId,
            name,
            avatar
        }
    });
}

export async function logoutUser({ email, password }) {
    // 登出 API
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

export async function changePassword({ email, currentPassword, newPassword }) {
    // 密碼修改 API
    return apiRequest('/user/changePassword', {
        method: 'POST',
        body: { email, currentPassword, newPassword }
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
        console.log('刷新 token 結果:', refreshResult);
        
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


