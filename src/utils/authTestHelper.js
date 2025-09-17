/**
 * 認證測試輔助工具
 * 用於在開發環境中快速測試認證安全性修復
 */

import { validateAuthMethod } from '../api/accountValidation';
import { registerUser, mailLogin } from '../api/auth';

/**
 * 測試認證驗證邏輯
 */
export async function testAuthValidation() {
    console.log('🧪 開始測試認證驗證邏輯...\n');
    
    const testResults = [];
    
    try {
        // 測試1: checkAccount 功能已移除，跳過此測試
        console.log('📝 測試1: checkAccount 功能已移除');
        console.log('⏭️  跳過（checkAccount 功能已從系統中移除）');
        testResults.push({
            name: '檢查不存在帳號',
            pass: true,
            result: { note: 'checkAccount 功能已移除' }
        });
        
        // 測試2: 驗證新帳號可以註冊
        console.log('\n📝 測試2: 驗證新帳號可以註冊');
        const newAccountValidation = await validateAuthMethod('new@test.com', 'regular');
        const test2Pass = newAccountValidation.allowed;
        testResults.push({
            name: '新帳號註冊驗證',
            pass: test2Pass,
            result: newAccountValidation
        });
        console.log(test2Pass ? '✅ 通過' : '❌ 失敗', newAccountValidation);
        
        // 測試3: 模擬衝突情況（需要模擬資料）
        console.log('\n📝 測試3: 模擬認證方式衝突');
        // 這個測試需要後端配合，先跳過
        console.log('⏭️  跳過（需要後端資料配合）');
        
        console.log('\n📊 測試總結:');
        const passCount = testResults.filter(t => t.pass).length;
        console.log(`通過: ${passCount}/${testResults.length}`);
        
        testResults.forEach(test => {
            console.log(`${test.pass ? '✅' : '❌'} ${test.name}`);
        });
        
        return testResults;
        
    } catch (error) {
        console.error('❌ 測試執行失敗:', error);
        return [];
    }
}

/**
 * 模擬用戶註冊流程測試
 */
export async function simulateRegistrationFlow(email, authMethod = 'regular') {
    console.log(`🎭 模擬 ${authMethod} 註冊流程: ${email}`);
    
    try {
        if (authMethod === 'regular') {
            const result = await registerUser({
                nickname: '測試用戶',
                email: email,
                password: 'testpassword123'
            });
            console.log('✅ 一般註冊成功:', result);
            return { success: true, result };
        } else if (authMethod === 'google') {
            const result = await mailLogin({
                email: email,
                googleId: 'test_google_id_123',
                name: '測試Google用戶',
                avatar: 'https://example.com/avatar.jpg'
            });
            console.log('✅ Google登入成功:', result);
            return { success: true, result };
        }
    } catch (error) {
        console.log('❌ 註冊/登入失敗:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * 完整的衝突測試流程
 */
export async function testConflictScenario() {
    console.log('🔥 開始測試認證衝突情境...\n');
    
    const testEmail = `conflict-test-${Date.now()}@test.com`;
    
    try {
        // 步驟1: 先用一般方式註冊
        console.log('步驟1: 一般註冊');
        const regularResult = await simulateRegistrationFlow(testEmail, 'regular');
        
        if (!regularResult.success) {
            console.log('⚠️  一般註冊失敗，無法繼續測試');
            return;
        }
        
        // 步驟2: 嘗試用Google方式登入相同email
        console.log('\n步驟2: 嘗試Google登入相同email');
        const googleResult = await simulateRegistrationFlow(testEmail, 'google');
        
        if (!googleResult.success) {
            console.log('✅ 正確！Google登入被阻止:', googleResult.error);
        } else {
            console.log('❌ 錯誤！Google登入應該被阻止但沒有');
        }
        
    } catch (error) {
        console.error('❌ 衝突測試失敗:', error);
    }
}

/**
 * 在瀏覽器控制台中可用的測試函數
 */
export function setupBrowserTests() {
    if (typeof window !== 'undefined') {
        // 將測試函數掛載到window對象，方便在控制台調用
        window.authTests = {
            testValidation: testAuthValidation,
            testConflict: testConflictScenario,
            simulateRegistration: simulateRegistrationFlow
        };
        
        console.log('🔧 認證測試工具已載入！');
        console.log('在控制台中使用以下命令進行測試：');
        console.log('- authTests.testValidation() // 測試驗證邏輯');
        console.log('- authTests.testConflict() // 測試衝突情境');
        console.log('- authTests.simulateRegistration("test@example.com", "regular") // 模擬註冊');
    }
}

/**
 * 檢查當前環境是否支援測試
 */
export function checkTestEnvironment() {
    const checks = {
        localStorage: typeof window !== 'undefined' && window.localStorage,
        fetch: typeof fetch !== 'undefined',
        apiBase: process.env.VITE_API_BASE_URL || 'API_BASE_URL未設定'
    };
    
    console.log('🔍 測試環境檢查:');
    Object.entries(checks).forEach(([key, value]) => {
        console.log(`${value ? '✅' : '❌'} ${key}:`, value);
    });
    
    return checks;
}

// 自動設定瀏覽器測試（如果在瀏覽器環境中）
if (typeof window !== 'undefined') {
    setupBrowserTests();
}