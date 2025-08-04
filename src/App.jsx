import React, { useState } from 'react';
import * as Tone from 'tone';
import { GoogleOAuthProvider } from '@react-oauth/google';
import HomePage from './components/HomePage.jsx';
import TransitionPage from './components/TransitionPage.jsx';
import QuestionnairePage from './components/QuestionnairePage.jsx';
import LoginPage from './components/LoginPage.jsx';

export default function App() {
    const [currentPage, setCurrentPage] = useState('home');

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

    const renderPage = () => {
        switch (currentPage) {
            case 'transition':
                return <TransitionPage onNavigate={handleNavigate} />;
            case 'questionnaire':
                return <QuestionnairePage onNavigate={handleNavigate} />;
            case 'login':
                return <LoginPage onNavigate={handleNavigate} />;
            case 'home':
            default:
                return <HomePage onNavigate={handleNavigate} />;
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