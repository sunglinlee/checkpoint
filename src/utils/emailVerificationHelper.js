/**
 * 信箱驗證輔助函數
 * 提供各種信箱驗證相關的工具函數
 */

/**
 * 從 URL 中解析驗證參數
 * @param {string} url - 要解析的 URL，預設為當前頁面 URL
 * @returns {Object} 包含 token, email, error 的物件
 */
export function parseVerificationUrl(url = window.location.href) {
    try {
        const urlObj = new URL(url);
        const params = urlObj.searchParams;
        
        return {
            token: params.get('token'),
            email: params.get('email'),
            error: params.get('error'),
            hasVerificationParams: !!(params.get('token') || params.get('email') || params.get('error'))
        };
    } catch (error) {
        console.error('解析驗證 URL 失敗:', error);
        return {
            token: null,
            email: null,
            error: null,
            hasVerificationParams: false
        };
    }
}

/**
 * 生成驗證信連結
 * @param {string} baseUrl - 基礎 URL
 * @param {string} token - 驗證 token
 * @param {string} email - 用戶 email
 * @returns {string} 完整的驗證連結
 */
export function generateVerificationLink(baseUrl, token, email) {
    const url = new URL('/verify-email', baseUrl);
    url.searchParams.set('token', token);
    url.searchParams.set('email', email);
    return url.toString();
}

/**
 * 生成錯誤驗證連結
 * @param {string} baseUrl - 基礎 URL
 * @param {string} error - 錯誤類型
 * @param {string} email - 用戶 email（可選）
 * @returns {string} 錯誤頁面連結
 */
export function generateErrorVerificationLink(baseUrl, error, email = null) {
    const url = new URL('/verify-email', baseUrl);
    url.searchParams.set('error', error);
    if (email) {
        url.searchParams.set('email', email);
    }
    return url.toString();
}

/**
 * 驗證 email 格式
 * @param {string} email - 要驗證的 email
 * @returns {boolean} 是否為有效的 email 格式
 */
export function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * 驗證 token 格式（基本檢查）
 * @param {string} token - 要驗證的 token
 * @returns {boolean} 是否為有效的 token 格式
 */
export function isValidToken(token) {
    if (!token || typeof token !== 'string') return false;
    
    // 基本長度檢查（至少 10 個字元）
    return token.length >= 10;
}

/**
 * 檢查是否為驗證相關的 URL
 * @param {string} url - 要檢查的 URL
 * @returns {boolean} 是否為驗證相關 URL
 */
export function isVerificationUrl(url = window.location.href) {
    try {
        const urlObj = new URL(url);
        return urlObj.pathname.includes('verify-email') || 
               urlObj.searchParams.has('token') || 
               urlObj.searchParams.has('error');
    } catch (error) {
        return false;
    }
}

/**
 * 格式化驗證狀態訊息
 * @param {string} status - 驗證狀態
 * @param {string} message - 原始訊息
 * @returns {string} 格式化後的訊息
 */
export function formatVerificationMessage(status, message) {
    const statusMessages = {
        'success': '✅ 驗證成功',
        'error': '❌ 驗證失敗',
        'expired': '⏰ 驗證連結已過期',
        'invalid': '🚫 驗證連結無效',
        'already_verified': '✅ 信箱已驗證',
        'loading': '⏳ 驗證中...'
    };

    const statusPrefix = statusMessages[status] || '';
    return statusPrefix ? `${statusPrefix} ${message}` : message;
}

/**
 * 檢查驗證錯誤類型
 * @param {Error} error - API 錯誤物件
 * @returns {string} 錯誤類型
 */
export function getVerificationErrorType(error) {
    if (!error) return 'unknown';

    const status = error.status;
    const message = error.message?.toLowerCase() || '';

    if (status === 400) {
        if (message.includes('expired') || message.includes('過期')) {
            return 'expired';
        } else if (message.includes('invalid') || message.includes('無效')) {
            return 'invalid';
        }
        return 'invalid';
    } else if (status === 404) {
        return 'not_found';
    } else if (status === 409) {
        return 'already_verified';
    } else if (status === 429) {
        return 'rate_limited';
    } else if (status >= 500) {
        return 'server_error';
    }

    return 'unknown';
}

/**
 * 生成用戶友好的錯誤訊息
 * @param {string} errorType - 錯誤類型
 * @param {string} originalMessage - 原始錯誤訊息
 * @returns {string} 用戶友好的錯誤訊息
 */
export function getUserFriendlyErrorMessage(errorType, originalMessage = '') {
    const errorMessages = {
        'expired': '驗證連結已過期，請重新發送驗證信',
        'invalid': '驗證連結無效，請檢查連結是否正確',
        'not_found': '找不到對應的驗證請求，請重新發送驗證信',
        'already_verified': '您的信箱已經驗證過了',
        'rate_limited': '發送過於頻繁，請稍後再試',
        'server_error': '伺服器暫時無法處理請求，請稍後再試',
        'unknown': originalMessage || '驗證過程中發生未知錯誤'
    };

    return errorMessages[errorType] || errorMessages['unknown'];
}

/**
 * 儲存驗證狀態到 localStorage
 * @param {string} email - 用戶 email
 * @param {boolean} verified - 驗證狀態
 */
export function saveVerificationStatus(email, verified) {
    if (typeof window === 'undefined') return;

    try {
        const key = `email_verification_${email}`;
        const data = {
            verified,
            timestamp: Date.now()
        };
        window.localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.warn('無法儲存驗證狀態:', error);
    }
}

/**
 * 從 localStorage 讀取驗證狀態
 * @param {string} email - 用戶 email
 * @returns {Object|null} 驗證狀態資料
 */
export function loadVerificationStatus(email) {
    if (typeof window === 'undefined') return null;

    try {
        const key = `email_verification_${email}`;
        const data = window.localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.warn('無法讀取驗證狀態:', error);
        return null;
    }
}

/**
 * 清除驗證狀態快取
 * @param {string} email - 用戶 email
 */
export function clearVerificationStatus(email) {
    if (typeof window === 'undefined') return;

    try {
        const key = `email_verification_${email}`;
        window.localStorage.removeItem(key);
    } catch (error) {
        console.warn('無法清除驗證狀態:', error);
    }
}

/**
 * 檢查驗證狀態是否過期（24小時）
 * @param {Object} statusData - 驗證狀態資料
 * @returns {boolean} 是否過期
 */
export function isVerificationStatusExpired(statusData) {
    if (!statusData || !statusData.timestamp) return true;
    
    const twentyFourHours = 24 * 60 * 60 * 1000;
    return Date.now() - statusData.timestamp > twentyFourHours;
}

/**
 * 驗證頁面導航輔助函數
 * @param {string} page - 目標頁面
 * @param {Object} params - URL 參數
 */
export function navigateToVerificationPage(page, params = {}) {
    const url = new URL(window.location);
    url.searchParams.set('page', page);
    
    Object.entries(params).forEach(([key, value]) => {
        if (value) {
            url.searchParams.set(key, value);
        }
    });
    
    window.history.pushState({}, '', url);
    window.location.reload();
}
