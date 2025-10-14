import React, { useState, useEffect } from 'react';
import { refreshToken, loadAuth, startTokenRefresh, stopTokenRefresh } from '../api/auth';

export default function RefreshTokenTestPage({ onNavigate }) {
    const [testResults, setTestResults] = useState([]);
    const [isAutoRefreshActive, setIsAutoRefreshActive] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [testInterval, setTestInterval] = useState(null);

    useEffect(() => {
        // 載入當前用戶資訊
        const { user } = loadAuth();
        setCurrentUser(user);
        
        return () => {
            // 清理測試間隔
            if (testInterval) {
                clearInterval(testInterval);
            }
        };
    }, []);

    const addTestResult = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        setTestResults(prev => [...prev, { 
            message, 
            type, 
            timestamp 
        }]);
    };

    // 手動測試 refreshToken
    const testRefreshTokenManually = async () => {
        if (!currentUser?.email) {
            addTestResult('❌ 請先登入才能測試 refreshToken', 'error');
            return;
        }

        try {
            addTestResult(`🔄 開始測試 refreshToken (${currentUser.email})...`, 'info');
            const result = await refreshToken(currentUser.email);
            addTestResult(`✅ refreshToken 成功: ${result}`, 'success');
        } catch (error) {
            addTestResult(`❌ refreshToken 失敗: ${error.message}`, 'error');
            console.error('RefreshToken error:', error);
        }
    };

    // 啟動自動刷新測試 (每10秒一次)
    const startAutoRefreshTest = () => {
        if (!currentUser?.email) {
            addTestResult('❌ 請先登入才能啟動自動刷新測試', 'error');
            return;
        }

        if (isAutoRefreshActive) {
            addTestResult('⚠️ 自動刷新測試已在進行中', 'warning');
            return;
        }

        addTestResult('🚀 啟動自動刷新測試 (每10秒一次)', 'info');
        setIsAutoRefreshActive(true);

        const interval = setInterval(async () => {
            try {
                const result = await refreshToken(currentUser.email);
                addTestResult(`🔄 自動刷新成功: ${result}`, 'success');
            } catch (error) {
                addTestResult(`❌ 自動刷新失敗: ${error.message}`, 'error');
            }
        }, 10000); // 每10秒執行一次

        setTestInterval(interval);
    };

    // 停止自動刷新測試
    const stopAutoRefreshTest = () => {
        if (testInterval) {
            clearInterval(testInterval);
            setTestInterval(null);
        }
        setIsAutoRefreshActive(false);
        addTestResult('⏹️ 已停止自動刷新測試', 'info');
    };

    // 測試正式的自動刷新機制
    const testOfficialAutoRefresh = () => {
        if (!currentUser?.email) {
            addTestResult('❌ 請先登入才能測試正式自動刷新', 'error');
            return;
        }

        stopTokenRefresh(); // 先停止現有的
        startTokenRefresh(currentUser.email); // 啟動正式的30分鐘刷新
        addTestResult('✅ 已啟動正式自動刷新機制 (30分鐘間隔)', 'success');
        addTestResult('💡 請打開 F12 Network 標籤，等待30分鐘後查看請求', 'info');
    };

    // 停止正式的自動刷新機制
    const stopOfficialAutoRefresh = () => {
        stopTokenRefresh();
        addTestResult('⏹️ 已停止正式自動刷新機制', 'info');
    };

    // 清除測試結果
    const clearResults = () => {
        setTestResults([]);
    };

    const getResultColor = (type) => {
        switch (type) {
            case 'success': return 'text-green-600';
            case 'error': return 'text-red-600';
            case 'warning': return 'text-yellow-600';
            default: return 'text-blue-600';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
            <div className="max-w-4xl mx-auto">
                {/* 頁面標題 */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        RefreshToken 測試頁面
                    </h1>
                    <button
                        onClick={() => onNavigate('home')}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        返回首頁
                    </button>
                </div>

                {/* 當前用戶資訊 */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">當前用戶資訊</h2>
                    {currentUser ? (
                        <div className="space-y-2">
                            <p><span className="font-medium">Email:</span> {currentUser.email}</p>
                            <p><span className="font-medium">Name:</span> {currentUser.name || currentUser.nickname || 'N/A'}</p>
                            <p className="text-green-600">✅ 已登入，可以進行測試</p>
                        </div>
                    ) : (
                        <div className="text-red-600">
                            ❌ 未登入，請先<button 
                                onClick={() => onNavigate('login')}
                                className="text-blue-600 underline hover:text-blue-800"
                            >登入</button>後再進行測試
                        </div>
                    )}
                </div>

                {/* 測試控制面板 */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">測試控制面板</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 手動測試 */}
                        <button
                            onClick={testRefreshTokenManually}
                            className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
                            disabled={!currentUser}
                        >
                            🔄 手動測試 RefreshToken
                        </button>

                        {/* 自動測試控制 */}
                        {!isAutoRefreshActive ? (
                            <button
                                onClick={startAutoRefreshTest}
                                className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
                                disabled={!currentUser}
                            >
                                🚀 啟動自動測試 (10秒間隔)
                            </button>
                        ) : (
                            <button
                                onClick={stopAutoRefreshTest}
                                className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                ⏹️ 停止自動測試
                            </button>
                        )}

                        {/* 正式自動刷新控制 */}
                        <button
                            onClick={testOfficialAutoRefresh}
                            className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:bg-gray-400"
                            disabled={!currentUser}
                        >
                            ✅ 啟動正式自動刷新 (30分鐘)
                        </button>

                        <button
                            onClick={stopOfficialAutoRefresh}
                            className="px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            ⏹️ 停止正式自動刷新
                        </button>

                        {/* 清除結果 */}
                        <button
                            onClick={clearResults}
                            className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors md:col-span-2"
                        >
                            🗑️ 清除測試結果
                        </button>
                    </div>
                </div>

                {/* 測試結果顯示 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">測試結果</h2>
                    <div className="max-h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50">
                        {testResults.length === 0 ? (
                            <p className="text-gray-500">尚無測試結果...</p>
                        ) : (
                            <div className="space-y-2">
                                {testResults.map((result, index) => (
                                    <div key={index} className="text-sm">
                                        <span className="text-gray-500">[{result.timestamp}]</span>
                                        <span className={`ml-2 ${getResultColor(result.type)}`}>
                                            {result.message}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 使用說明 */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">使用說明</h3>
                    <ul className="text-yellow-700 space-y-1 text-sm">
                        <li>• <strong>手動測試</strong>：立即執行一次 refreshToken 請求</li>
                        <li>• <strong>自動測試</strong>：每10秒自動執行 refreshToken（用於快速測試）</li>
                        <li>• <strong>正式自動刷新</strong>：啟動正式的30分鐘間隔自動刷新機制</li>
                        <li>• 請確保已登入且打開 F12 Network 標籤來查看網路請求</li>
                        <li>• 測試完成後建議停止自動測試以避免過多請求</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}