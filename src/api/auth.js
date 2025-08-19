import { apiRequest } from './client';

export async function registerUser({ nickname, email, password }) {
    // 依 Swagger 定義：假設路徑與鍵名如下，如有差異請調整
    return apiRequest('/user/register', {
        method: 'POST',
        body: { nickname, email, password }
    });
}

export async function loginUser({ email, password }) {
    return apiRequest('/user/login', {
        method: 'POST',
        body: { email, password }
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


