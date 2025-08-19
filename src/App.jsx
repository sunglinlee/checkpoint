import React, { useState } from 'react';
import * as Tone from 'tone';
import { GoogleOAuthProvider } from '@react-oauth/google';
import HomePage from './components/HomePage.jsx';
import TransitionPage from './components/TransitionPage.jsx';
import QuestionnairePage from './components/QuestionnairePage.jsx';
import LoginPage from './components/LoginPage.jsx';
import ReviewPage from './components/ReviewPage.jsx';
import { loadAuth, clearAuth } from './api/auth';

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
        setUser(null);
        setCurrentPage('home');
    };

    const updateUserNickname = (nickname) => {
        if (user) {
            setUser({ ...user, nickname });
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
            case 'home':
            default:
                return <HomePage onNavigate={handleNavigate} user={user} onLogout={handleLogout} updateUserNickname={updateUserNickname} />;
        }
    };

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "1032893971305-nqrk0r231cmb010bjmkbvsnlgqfnq129.apps.googleusercontent.com"}>
            <div className="font-['Noto_Sans_TC']">
                {renderPage()}
            </div>
        </GoogleOAuthProvider>
    );
} 