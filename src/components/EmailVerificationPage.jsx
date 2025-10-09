import React, { useState, useEffect } from 'react';
import { verifyEmail, resendVerificationEmail } from '../api/emailVerification';

export default function EmailVerificationPage({ onNavigate }) {
    const [verificationStatus, setVerificationStatus] = useState('loading'); // loading, success, error, expired
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [isResending, setIsResending] = useState(false);
    const [resendMessage, setResendMessage] = useState('');

    useEffect(() => {
        // 從 URL 參數中取得 token 和 email
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const emailParam = urlParams.get('email');
        const error = urlParams.get('error');

        if (emailParam) {
            setEmail(emailParam);
        }

        // 如果有錯誤參數，直接顯示錯誤
        if (error) {
            handleVerificationError(error);
            return;
        }

        // 如果有 token 和 email，進行驗證
        if (token && emailParam) {
            performVerification(token, emailParam);
        } else {
            // 缺少必要參數
            setVerificationStatus('error');
            setMessage('驗證連結無效，缺少必要的參數。');
        }
    }, []);

    const performVerification = async (token, email) => {
        try {
            setVerificationStatus('loading');
            setMessage('正在驗證您的信箱...');

            const result = await verifyEmail(token, email);
            
            if (result.statusCode === '0000' || result.success) {
                setVerificationStatus('success');
                setMessage('恭喜！您的信箱已成功驗證。');
            } else {
                handleVerificationError(result.message || '驗證失敗');
            }
        } catch (error) {
            console.error('信箱驗證失敗:', error);
            
            // 根據錯誤狀態碼處理不同情況
            if (error.status === 400) {
                handleVerificationError('驗證連結無效或已過期');
            } else if (error.status === 404) {
                handleVerificationError('找不到對應的驗證請求');
            } else if (error.status === 409) {
                setVerificationStatus('success');
                setMessage('您的信箱已經驗證過了！');
            } else {
                handleVerificationError('驗證過程中發生錯誤，請稍後再試。');
            }
        }
    };

    const handleVerificationError = (errorMessage) => {
        setVerificationStatus('error');
        setMessage(errorMessage);
    };

    const handleResendVerification = async () => {
        if (!email) {
            setResendMessage('無法重新發送驗證信：缺少 email 資訊');
            return;
        }

        try {
            setIsResending(true);
            setResendMessage('');

            const result = await resendVerificationEmail(email);
            
            if (result.statusCode === '0000' || result.success) {
                setResendMessage('驗證信已重新發送，請檢查您的信箱。');
            } else {
                setResendMessage(result.message || '重新發送失敗，請稍後再試。');
            }
        } catch (error) {
            console.error('重新發送驗證信失敗:', error);
            
            if (error.status === 429) {
                setResendMessage('發送過於頻繁，請稍後再試。');
            } else if (error.status === 404) {
                setResendMessage('找不到對應的用戶帳號');
            } else {
                setResendMessage('重新發送失敗，請稍後再試。');
            }
        } finally {
            setIsResending(false);
        }
    };

    const handleGoToLogin = () => {
        onNavigate('login');
    };

    const handleGoToHome = () => {
        onNavigate('home');
    };

    const renderContent = () => {
        switch (verificationStatus) {
            case 'loading':
                return (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-lg text-gray-600">{message}</p>
                    </div>
                );

            case 'success':
                return (
                    <div className="text-center">
                        <div className="text-green-500 text-6xl mb-4">✓</div>
                        <h2 className="text-2xl font-bold text-green-600 mb-4">驗證成功！</h2>
                        <p className="text-lg text-gray-600 mb-6">{message}</p>
                        <div className="space-y-3">
                            <button
                                onClick={handleGoToLogin}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                            >
                                前往登入
                            </button>
                            <button
                                onClick={handleGoToHome}
                                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                            >
                                回到首頁
                            </button>
                        </div>
                    </div>
                );

            case 'error':
                return (
                    <div className="text-center">
                        <div className="text-red-500 text-6xl mb-4">✗</div>
                        <h2 className="text-2xl font-bold text-red-600 mb-4">驗證失敗</h2>
                        <p className="text-lg text-gray-600 mb-6">{message}</p>
                        
                        {email && (
                            <div className="mb-6">
                                <button
                                    onClick={handleResendVerification}
                                    disabled={isResending}
                                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                                >
                                    {isResending ? '發送中...' : '重新發送驗證信'}
                                </button>
                                {resendMessage && (
                                    <p className={`mt-2 text-sm ${resendMessage.includes('已重新發送') ? 'text-green-600' : 'text-red-600'}`}>
                                        {resendMessage}
                                    </p>
                                )}
                            </div>
                        )}
                        
                        <div className="space-y-3">
                            <button
                                onClick={handleGoToLogin}
                                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                            >
                                前往登入
                            </button>
                            <button
                                onClick={handleGoToHome}
                                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-6 rounded-lg transition duration-200"
                            >
                                回到首頁
                            </button>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="text-center">
                        <p className="text-lg text-gray-600">處理中...</p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
                        信箱驗證
                    </h1>
                    <p className="text-center text-gray-600">
                        請完成信箱驗證以啟用您的帳號
                    </p>
                </div>
                
                {renderContent()}
                
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        如有任何問題，請聯繫客服支援
                    </p>
                </div>
            </div>
        </div>
    );
}
