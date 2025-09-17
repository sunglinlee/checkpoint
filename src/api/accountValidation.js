/**
 * 驗證用戶是否可以使用指定的認證方式
 * 注意: checkAccount 功能已移除，現在總是允許任何認證方式
 * @param {string} email - 電子郵件
 * @param {'regular'|'google'} requestedAuthMethod - 請求的認證方式
 * @returns {Promise<{allowed: boolean, reason: string|null}>}
 */
export async function validateAuthMethod(email, requestedAuthMethod) {
    // checkAccount 功能已移除，總是允許任何認證方式
    // 讓後端處理重複帳號的檢查和錯誤回應
    return { allowed: true, reason: null };
}