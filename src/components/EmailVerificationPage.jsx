import React, { useState, useEffect } from 'react';
import { verifyEmail, resendVerificationEmail } from '../api/emailVerification';

const Logo = () => (
  <div className="flex items-center gap-2">
    <img src="https://storage.googleapis.com/checkpoint_frontend/logo/LOGO.png" alt="Check Point Logo" className="h-12 w-auto" />
    <img src="https://storage.googleapis.com/checkpoint_frontend/logo/LOGO_H1.png" alt="Company Name" className="h-10 w-auto" />
  </div>
);

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
                        <div className="w-16 h-16 mx-auto mb-6">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#8A9A87]/20 border-t-[#8A9A87]"></div>
                        </div>
                        <h2 className="text-2xl font-bold text-[#3D4A4D] mb-4">正在驗證信箱</h2>
                        <p className="text-gray-600">{message}</p>
                    </div>
                );

            case 'success':
                return (
                    <div className="text-center">
                        <div className="w-20 h-20 bg-[#8A9A87] rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-[#3D4A4D] mb-4">驗證成功！</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">{message}</p>
                        <div className="space-y-4">
                            <button
                                onClick={handleGoToLogin}
                                className="w-full bg-[#8A9A87] hover:bg-[#7A8A77] text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:ring-2 focus:ring-[#8A9A87] focus:ring-offset-2"
                            >
                                前往登入
                            </button>
                            <button
                                onClick={handleGoToHome}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-[#3D4A4D] font-semibold py-3 px-6 rounded-lg transition-colors"
                            >
                                回到首頁
                            </button>
                        </div>
                    </div>
                );

            case 'error':
                return (
                    <div className="text-center">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-[#3D4A4D] mb-4">驗證失敗</h2>
                        <p className="text-lg text-gray-600 mb-6">{message}</p>
                        
                        {email && (
                            <div className="mb-8">
                                <button
                                    onClick={handleResendVerification}
                                    disabled={isResending}
                                    className="w-full bg-[#8A9A87] hover:bg-[#7A8A77] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:ring-2 focus:ring-[#8A9A87] focus:ring-offset-2"
                                >
                                    {isResending ? '發送中...' : '重新發送驗證信'}
                                </button>
                                {resendMessage && (
                                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-sm text-blue-800">{resendMessage}</p>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        <div className="space-y-4">
                            <button
                                onClick={handleGoToLogin}
                                className="w-full bg-[#8A9A87] hover:bg-[#7A8A77] text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:ring-2 focus:ring-[#8A9A87] focus:ring-offset-2"
                            >
                                前往登入
                            </button>
                            <button
                                onClick={handleGoToHome}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-[#3D4A4D] font-semibold py-3 px-6 rounded-lg transition-colors"
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
        <div className="min-h-screen bg-[#FDFCF9] flex flex-col">
            {/* Header */}
            <header className="py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b border-gray-200/50">
                <a href="#" onClick={e => { e.preventDefault(); onNavigate('home'); }}>
                    <Logo />
                </a>
                <button 
                    onClick={() => onNavigate('home')}
                    className="text-[#5C6B68] hover:text-[#8A9A87] transition-colors"
                >
                    返回首頁
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-[#3D4A4D] mb-2">信箱驗證</h1>
                            <p className="text-gray-600">請稍候，我們正在處理您的驗證請求</p>
                        </div>
                        
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
}
