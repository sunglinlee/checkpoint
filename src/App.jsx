import React, { useState } from 'react';
import * as Tone from 'tone';
import HomePage from './components/HomePage.jsx';
import TransitionPage from './components/TransitionPage.jsx';
import QuestionnairePage from './components/QuestionnairePage.jsx';

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
            case 'home':
            default:
                return <HomePage onNavigate={handleNavigate} />;
        }
    };

    return (
        <div className="font-['Noto_Sans_TC']">
            {renderPage()}
        </div>
    );
} 