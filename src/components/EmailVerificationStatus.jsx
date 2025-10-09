import React, { useState, useEffect } from 'react';
import { checkEmailVerificationStatus, resendVerificationEmail } from '../api/emailVerification';

export default function EmailVerificationStatus({ user, onVerificationComplete }) {
    const [verificationStatus, setVerificationStatus] = useState(null); // null, verified, unverified
    const [isChecking, setIsChecking] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendMessage, setResendMessage] = useState('');
    const [showStatus, setShowStatus] = useState(false);

    useEffect(() => {
        if (user?.email) {
            checkStatus();
        }
    }, [user?.email]);

    const checkStatus = async () => {
        if (!user?.email) return;

        try {
            setIsChecking(true);
            const result = await checkEmailVerificationStatus(user.email);
            
            if (result.statusCode === '0000' || result.success) {
                const isVerified = result.data?.verified || false;
                setVerificationStatus(isVerified ? 'verified' : 'unverified');
                setShowStatus(!isVerified); // 只有未驗證時才顯示提醒
            }
        } catch (error) {
            console.error('檢查驗證狀態失敗:', error);
            // 如果檢查失敗，預設為未驗證狀態
            setVerificationStatus('unverified');
            setShowStatus(true);
        } finally {
            setIsChecking(false);
        }
    };

    const handleResendVerification = async () => {
        if (!user?.email) return;

        try {
            setIsResending(true);
            setResendMessage('');

            const result = await resendVerificationEmail(user.email);
            
            if (result.statusCode === '0000' || result.success) {
                setResendMessage('驗證信已重新發送，請檢查您的信箱');
            } else {
                setResendMessage(result.message || '重新發送失敗，請稍後再試');
            }
        } catch (error) {
            console.error('重新發送驗證信失敗:', error);
            
            if (error.status === 429) {
                setResendMessage('發送過於頻繁，請稍後再試');
            } else if (error.status === 404) {
                setResendMessage('找不到對應的用戶帳號');
            } else {
                setResendMessage('重新發送失敗，請稍後再試');
            }
        } finally {
            setIsResending(false);
        }
    };

    const handleDismiss = () => {
        setShowStatus(false);
    };

    const handleVerifyNow = () => {
        // 可以導向到驗證頁面或顯示驗證說明
        if (onVerificationComplete) {
            onVerificationComplete();
        }
    };

    // 如果正在檢查狀態，顯示載入中
    if (isChecking) {
        return (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-3"></div>
                    <span className="text-blue-700">正在檢查信箱驗證狀態...</span>
                </div>
            </div>
        );
    }

    // 如果已驗證或不需要顯示狀態，返回 null
    if (verificationStatus === 'verified' || !showStatus) {
        return null;
    }

    // 顯示未驗證提醒
    return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-yellow-800">
                        信箱尚未驗證
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                        <p>
                            您的信箱 <span className="font-medium">{user?.email}</span> 尚未驗證。
                            請檢查您的信箱並點擊驗證連結，或重新發送驗證信。
                        </p>
                    </div>
                    <div className="mt-3 flex flex-col sm:flex-row gap-2">
                        <button
                            onClick={handleResendVerification}
                            disabled={isResending}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-800 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
                        >
                            {isResending ? '發送中...' : '重新發送驗證信'}
                        </button>
                        <button
                            onClick={handleVerifyNow}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                        >
                            立即驗證
                        </button>
                        <button
                            onClick={handleDismiss}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            稍後提醒
                        </button>
                    </div>
                    {resendMessage && (
                        <div className={`mt-2 text-sm ${resendMessage.includes('已重新發送') ? 'text-green-600' : 'text-red-600'}`}>
                            {resendMessage}
                        </div>
                    )}
                </div>
                <div className="ml-4 flex-shrink-0">
                    <button
                        onClick={handleDismiss}
                        className="bg-yellow-50 rounded-md inline-flex text-yellow-400 hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                        <span className="sr-only">關閉</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
