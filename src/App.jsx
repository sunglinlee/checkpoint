import React, { useEffect, useState } from 'react';
import * as Tone from 'tone';
import { GoogleOAuthProvider } from '@react-oauth/google';
import HomePage from './components/HomePage.jsx';
import TransitionPage from './components/TransitionPage.jsx';
import QuestionnairePage from './components/QuestionnairePage.jsx';
import LoginPage from './components/LoginPage.jsx';
import ReviewPage from './components/ReviewPage.jsx';
import CheckReviewPage from './components/CheckReviewPage.jsx';
import { loadAuth, clearAuth, startTokenRefresh, stopTokenRefresh } from './api/auth';

export default function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [user, setUser] = useState(loadAuth().user || null);

    const handleNavigate = (page) => {
        // Stop music when navigating away from transition page
        if (currentPage === 'transition' && page !== 'transition') {
             if (Tone.Transport.state === 'started') {
                Tone.Transport.pause();
             }
        }
        setCurrentPage(page);
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
            setUser(updatedUser);
            // 將更新後的用戶資料持久化到 localStorage
            if (typeof window !== 'undefined') {
                window.localStorage.setItem('authUser', JSON.stringify(updatedUser));
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
            case 'home':
            default:
                return <HomePage onNavigate={handleNavigate} user={user} onLogout={handleLogout} updateUserNickname={updateUserNickname} />;
        }
    };

    // App 載入後，如已有登入狀態則啟動 refresh 排程
    useEffect(() => {
        const { user } = loadAuth();
        if (user?.email) {
            stopTokenRefresh();
            startTokenRefresh(user.email);
        } else {
            stopTokenRefresh();
        }
    }, []);

    return (
        //<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "1032893971305-nqrk0r231cmb010bjmkbvsnlgqfnq129.apps.googleusercontent.com"}>
        <GoogleOAuthProvider clientId="357565914560-ggnsu1d3pkrrkj0bmedt7sb543k1bdba.apps.googleusercontent.com">
            <div className="font-['Noto_Sans_TC']">
                {renderPage()}
            </div>
        </GoogleOAuthProvider>
    );
} 