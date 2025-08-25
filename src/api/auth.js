import { apiRequest } from './client';

export async function registerUser({ nickname, email, password }) {
    // 一般註冊 API - 將 nickname 對應到後端的 name 欄位
    return apiRequest('/user/register', {
        method: 'POST',
        body: { name: nickname, email, password }
    });
}

export async function mailRegister(googleToken) {
    // Google 第三方登入 API - 從 Google token 中獲取用戶資訊
    try {
        // 從 Google token 中解析用戶資訊
        const userInfo = await getGoogleUserInfo(googleToken);
        
        return apiRequest('/user/mailRegister', {
            method: 'POST',
            body: { 
                name: userInfo.nickname, 
                email: userInfo.email, 
                googleToken: googleToken 
            }
        });
    } catch (error) {
        console.error('Google 登入失敗:', error);
        throw error;
    }
}

// 從 Google token 獲取用戶資訊的輔助函數
async function getGoogleUserInfo(googleToken) {
    try {
        const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                'Authorization': `Bearer ${googleToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('無法獲取 Google 用戶資訊');
        }
        
        const userData = await response.json();
        
        return {
            nickname: userData.name || userData.given_name || 'Google User',
            email: userData.email
        };
    } catch (error) {
        console.error('獲取 Google 用戶資訊失敗:', error);
        throw error;
    }
}

export async function loginUser({ email, password }) {
    // 一般登入 API
    return apiRequest('/user/login', {
        method: 'POST',
        body: { email, password }
    });
}

export async function mailLogin({ email, password }) {
    // 信箱登入 API
    return apiRequest('/user/mailLogin', {
        method: 'POST',
        body: { email, password }
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


