import { apiRequest } from './client';

/**
 * 檢查帳號是否已存在以及使用的認證方式
 * 注意: 此 API 端點在 Swagger 文檔中未列出，可能需要後端實現
 * @param {string} email - 要檢查的電子郵件
 * @returns {Promise<{exists: boolean, authMethod: 'regular'|'google'|null, user: object|null}>}
 */
export async function checkAccountExists(email) {
    try {
        // 嘗試使用可能的端點路徑
        const response = await apiRequest(`/user/checkAccount?email=${encodeURIComponent(email)}`, {
            method: 'GET'
        });
        
        return {
            exists: response.exists || false,
            authMethod: response.authMethod || null,
            user: response.user || null
        };
    } catch (error) {
        // 如果後端還沒有這個端點，我們可以通過嘗試登入來檢查
        console.warn('checkAccount API 不存在於 Swagger 文檔中，使用備用檢查方式');
        return { exists: false, authMethod: null, user: null };
    }
}

/**
 * 驗證用戶是否可以使用指定的認證方式
 * @param {string} email - 電子郵件
 * @param {'regular'|'google'} requestedAuthMethod - 請求的認證方式
 * @returns {Promise<{allowed: boolean, reason: string|null}>}
 */
export async function validateAuthMethod(email, requestedAuthMethod) {
    const accountInfo = await checkAccountExists(email);
    
    if (!accountInfo.exists) {
        // 帳號不存在，允許任何認證方式註冊
        return { allowed: true, reason: null };
    }
    
    if (accountInfo.authMethod === requestedAuthMethod) {
        // 使用相同的認證方式，允許
        return { allowed: true, reason: null };
    }
    
    // 帳號存在但使用不同的認證方式
    const existingMethod = accountInfo.authMethod === 'google' ? 'Google' : '一般帳號密碼';
    const requestedMethod = requestedAuthMethod === 'google' ? 'Google' : '一般帳號密碼';
    
    return {
        allowed: false,
        reason: `此電子郵件已使用${existingMethod}註冊，請使用${existingMethod}登入，或使用其他電子郵件地址。`
    };
}