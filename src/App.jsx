import React, { useEffect, useState } from 'react';
import * as Tone from 'tone';
import { GoogleOAuthProvider } from '@react-oauth/google';
import HomePage from './components/HomePage.jsx';
import TransitionPage from './components/TransitionPage.jsx';
import QuestionnairePage from './components/QuestionnairePage.jsx';
import LoginPage from './components/LoginPage.jsx';
import ReviewPage from './components/ReviewPage.jsx';
import CheckReviewPage from './components/CheckReviewPage.jsx';
import MobileTestPage from './components/MobileTestPage.jsx';
import EmailVerificationPage from './components/EmailVerificationPage.jsx';
import EmailVerificationTestPage from './components/EmailVerificationTestPage.jsx';
import RefreshTokenTestPage from './components/RefreshTokenTestPage.jsx';
import { loadAuth, clearAuth, startTokenRefresh, stopTokenRefresh } from './api/auth';
import { parseVerificationUrl, isVerificationUrl } from './utils/emailVerificationHelper';

export default function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [user, setUser] = useState(null);

    const handleNavigate = (page) => {
        // Stop music when navigating away from transition page
        if (currentPage === 'transition' && page !== 'transition') {
             if (Tone.Transport.state === 'started') {
                Tone.Transport.pause();
             }
        }
        setCurrentPage(page);
        
        // 更新 URL 參數
        const url = new URL(window.location);
        if (page !== 'home') {
            url.searchParams.set('page', page);
        } else {
            url.searchParams.delete('page');
            url.searchParams.delete('snapshot_id'); // 回到首頁時清除 snapshot_id
        }
        window.history.pushState({}, '', url);
        
        window.scrollTo(0, 0);
    };

    const handleLogout = () => {
        clearAuth();
        stopTokenRefresh();
        setUser(null);
        setCurrentPage('home');
    };

    const updateUserNickname = (nickname) => {
        if (user) {
            const updatedUser = { 
                ...user, 
                nickname: nickname,
                name: nickname  // 同時更新 name 字段，確保顯示一致性
            };
            
            console.log('更新前的用戶資料:', user);
            console.log('更新後的用戶資料:', updatedUser);
            
            setUser(updatedUser);
            
            // 將更新後的用戶資料持久化到 localStorage
            if (typeof window !== 'undefined') {
                window.localStorage.setItem('authUser', JSON.stringify(updatedUser));
                console.log('已保存到 localStorage:', JSON.stringify(updatedUser));
                
                // 驗證是否正確保存
                const saved = window.localStorage.getItem('authUser');
                console.log('從 localStorage 讀取的資料:', saved);
            }
        }
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'transition':
                return <TransitionPage onNavigate={handleNavigate} user={user} />;
            case 'questionnaire':
                return <QuestionnairePage onNavigate={handleNavigate} user={user} />;
            case 'login':
                return <LoginPage onNavigate={handleNavigate} setUser={setUser} updateUserNickname={updateUserNickname} />;
            case 'review':
                return <ReviewPage onNavigate={handleNavigate} user={user} />;
            case 'checkreview':
                return <CheckReviewPage onNavigate={handleNavigate} user={user} />;
            case 'mobiletest':
                return <MobileTestPage />;
            case 'email-verification':
                return <EmailVerificationPage onNavigate={handleNavigate} />;
            case 'email-verification-test':
                return <EmailVerificationTestPage />;
            case 'refresh-token-test':
                return <RefreshTokenTestPage onNavigate={handleNavigate} />;
            case 'home':
            default:
                return <HomePage onNavigate={handleNavigate} user={user} onLogout={handleLogout} updateUserNickname={updateUserNickname} />;
        }
    };

    // App 載入後，載入用戶狀態並啟動 refresh 排程
    useEffect(() => {
        const { user: loadedUser } = loadAuth();
        console.log('App 載入時從 localStorage 讀取的用戶資料:', loadedUser);
        
        // 設置載入的用戶資料
        setUser(loadedUser);
        
        if (loadedUser?.email) {
            stopTokenRefresh();
            startTokenRefresh(loadedUser.email);
        } else {
            stopTokenRefresh();
        }

        // 檢查 URL 參數並設置對應的頁面
        const urlParams = new URLSearchParams(window.location.search);
        const pageParam = urlParams.get('page');
        const snapshotId = urlParams.get('snapshot_id');
        
        // 檢查是否為信箱驗證相關的 URL
        if (isVerificationUrl()) {
            const verificationParams = parseVerificationUrl();
            if (verificationParams.hasVerificationParams) {
                setCurrentPage('email-verification');
                return; // 直接返回，不處理其他頁面參數
            }
        }
        
        // 如果有 snapshot_id 參數，將其存到 sessionStorage 供 CheckReviewPage 使用
        if (snapshotId) {
            try {
                window.sessionStorage.setItem('selectedSnapshotId', snapshotId);
            } catch (error) {
                console.warn('無法設置 sessionStorage:', error);
            }
        }
        
        if (pageParam) {
            // 支援的頁面列表
            const validPages = ['home', 'transition', 'questionnaire', 'login', 'review', 'checkreview', 'mobiletest', 'email-verification', 'email-verification-test', 'refresh-token-test'];
            if (validPages.includes(pageParam)) {
                setCurrentPage(pageParam);
            }
        }
    }, []); // 空依賴數組，只在組件掛載時執行一次

    return (
        //<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "1032893971305-nqrk0r231cmb010bjmkbvsnlgqfnq129.apps.googleusercontent.com"}>
        <GoogleOAuthProvider clientId="357565914560-ggnsu1d3pkrrkj0bmedt7sb543k1bdba.apps.googleusercontent.com">
            <div className="font-['Noto_Sans_TC']">
                {renderPage()}
            </div>
        </GoogleOAuthProvider>
    );
} 