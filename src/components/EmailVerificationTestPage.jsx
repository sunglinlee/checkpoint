import React, { useState } from 'react';
import { testEmailVerificationAPIs } from '../api/emailVerification';
import { parseVerificationUrl, generateVerificationLink, isValidEmail } from '../utils/emailVerificationHelper';

export default function EmailVerificationTestPage() {
    const [testResult, setTestResult] = useState('');
    const [isTesting, setIsTesting] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const [parsedParams, setParsedParams] = useState(null);
    const [emailInput, setEmailInput] = useState('');
    const [tokenInput, setTokenInput] = useState('');
    const [generatedLink, setGeneratedLink] = useState('');

    const handleTestAPIs = async () => {
        setIsTesting(true);
        setTestResult('正在測試 API...');
        
        try {
            const success = await testEmailVerificationAPIs();
            setTestResult(success ? '✅ 所有 API 測試通過！' : '❌ 部分 API 測試失敗');
        } catch (error) {
            setTestResult(`❌ API 測試失敗: ${error.message}`);
        } finally {
            setIsTesting(false);
        }
    };

    const handleParseUrl = () => {
        try {
            const params = parseVerificationUrl(urlInput || window.location.href);
            setParsedParams(params);
        } catch (error) {
            setParsedParams({ error: error.message });
        }
    };

    const handleGenerateLink = () => {
        if (!emailInput || !tokenInput) {
            alert('請輸入 email 和 token');
            return;
        }

        if (!isValidEmail(emailInput)) {
            alert('請輸入有效的 email 格式');
            return;
        }

        const link = generateVerificationLink(window.location.origin, tokenInput, emailInput);
        setGeneratedLink(link);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(generatedLink);
        alert('連結已複製到剪貼簿');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">信箱驗證功能測試頁面</h1>
                
                {/* API 測試區域 */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">API 測試</h2>
                    <button
                        onClick={handleTestAPIs}
                        disabled={isTesting}
                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
                    >
                        {isTesting ? '測試中...' : '測試所有 API'}
                    </button>
                    {testResult && (
                        <div className="mt-4 p-3 bg-gray-100 rounded">
                            <p>{testResult}</p>
                        </div>
                    )}
                </div>

                {/* URL 解析測試區域 */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">URL 參數解析測試</h2>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            輸入 URL（留空則使用當前頁面）:
                        </label>
                        <input
                            type="text"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            placeholder="https://example.com/verify-email?token=abc123&email=test@example.com"
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <button
                        onClick={handleParseUrl}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                    >
                        解析 URL
                    </button>
                    {parsedParams && (
                        <div className="mt-4 p-3 bg-gray-100 rounded">
                            <h3 className="font-semibold mb-2">解析結果:</h3>
                            <pre className="text-sm">{JSON.stringify(parsedParams, null, 2)}</pre>
                        </div>
                    )}
                </div>

                {/* 驗證連結生成區域 */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">驗證連結生成</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email:
                            </label>
                            <input
                                type="email"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                placeholder="user@example.com"
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Token:
                            </label>
                            <input
                                type="text"
                                value={tokenInput}
                                onChange={(e) => setTokenInput(e.target.value)}
                                placeholder="verification_token_123"
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleGenerateLink}
                        className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
                    >
                        生成驗證連結
                    </button>
                    {generatedLink && (
                        <div className="mt-4">
                            <h3 className="font-semibold mb-2">生成的連結:</h3>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={generatedLink}
                                    readOnly
                                    className="flex-1 p-2 border border-gray-300 rounded bg-gray-50"
                                />
                                <button
                                    onClick={handleCopyLink}
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                                >
                                    複製
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 功能說明區域 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">功能說明</h2>
                    <div className="space-y-4 text-sm text-gray-700">
                        <div>
                            <h3 className="font-semibold">1. API 測試</h3>
                            <p>測試所有信箱驗證相關的 API 端點，包括驗證信箱、重新發送驗證信、檢查驗證狀態等。</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">2. URL 參數解析</h3>
                            <p>解析包含驗證參數的 URL，提取 token、email 和錯誤資訊。</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">3. 驗證連結生成</h3>
                            <p>根據 email 和 token 生成完整的驗證連結，用於測試驗證流程。</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">4. 使用方式</h3>
                            <p>在實際使用中，用戶會收到包含驗證連結的郵件，點擊後會自動導向到 EmailVerificationPage 組件進行驗證。</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
