import { apiRequest } from './client';

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


