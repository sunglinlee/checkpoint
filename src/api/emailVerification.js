import { apiRequest } from './client';

/**
 * 驗證信箱 - 使用驗證 token 和 email 來驗證用戶信箱
 * @param {string} token - 驗證 token
 * @param {string} email - 用戶 email
 * @returns {Promise<{statusCode: string, message: string, data?: any}>}
 */
export async function verifyEmail(token, email) {
    return apiRequest('/user/verify-email', {
        method: 'POST',
        body: { token, email }
    });
}

/**
 * 重新發送驗證信 - 為指定 email 重新發送驗證信
 * @param {string} email - 用戶 email
 * @returns {Promise<{statusCode: string, message: string, data?: any}>}
 */
export async function resendVerificationEmail(email) {
    return apiRequest('/user/resend-verification', {
        method: 'POST',
        body: { email }
    });
}

/**
 * 檢查信箱驗證狀態 - 查詢指定 email 的驗證狀態
 * @param {string} email - 用戶 email
 * @returns {Promise<{statusCode: string, data: {verified: boolean, canResend: boolean}}>}
 */
export async function checkEmailVerificationStatus(email) {
    return apiRequest(`/user/email-verification-status?email=${encodeURIComponent(email)}`, {
        method: 'GET'
    });
}

/**
 * 測試信箱驗證 API 端點
 * @returns {Promise<boolean>}
 */
export async function testEmailVerificationAPIs() {
    console.log('開始測試信箱驗證 API 端點...');
    
    const testEmail = 'test@example.com';
    const testToken = 'test_verification_token_123';
    
    try {
        // 測試檢查驗證狀態
        console.log('測試檢查驗證狀態...');
        const statusResult = await checkEmailVerificationStatus(testEmail);
        console.log('檢查驗證狀態結果:', statusResult);
        
        // 測試重新發送驗證信
        console.log('測試重新發送驗證信...');
        const resendResult = await resendVerificationEmail(testEmail);
        console.log('重新發送驗證信結果:', resendResult);
        
        // 測試驗證信箱（這個可能會失敗，因為是測試 token）
        console.log('測試驗證信箱...');
        try {
            const verifyResult = await verifyEmail(testToken, testEmail);
            console.log('驗證信箱結果:', verifyResult);
        } catch (error) {
            console.log('驗證信箱預期失敗（測試 token）:', error.message);
        }
        
        console.log('信箱驗證 API 測試完成！');
        return true;
    } catch (error) {
        console.error('信箱驗證 API 測試失敗:', error);
        return false;
    }
}
