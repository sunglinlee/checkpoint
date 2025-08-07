import React, { useState, useEffect, useRef } from 'react';
import { icons } from './icons.jsx';

const TransitionPage = ({ onNavigate }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        // 初始化音頻
        audioRef.current = new Audio('/素材/SpaceTimeThought.mp3');
        audioRef.current.volume = 0.2; // 設定預設音量為20%
        audioRef.current.loop = true; // 設定循環播放

        // 自動播放音樂
        const autoPlayMusic = async () => {
            try {
                await audioRef.current.play();
                setIsPlaying(true);
            } catch (error) {
                console.log('自動播放失敗，需要用戶互動才能播放音樂');
            }
        };

        autoPlayMusic();

        // 清理函數
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const toggleMusic = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="bg-[#FDFCF9] min-h-screen w-full flex flex-col items-center justify-center p-4 text-[#3D4A4D] text-center">
            {/* 返回按鈕 */}
            <div className="absolute top-6 left-6">
                <button 
                    onClick={() => onNavigate('home')} 
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors text-gray-600"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>返回首頁</span>
                </button>
            </div>
            <div className="w-full max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12 animate-fade-in">
                <h2 className="text-2xl md:text-3xl font-bold text-[#5C6B68] mb-6">一個與自己獨處的邀請</h2>
                <div className="text-lg text-gray-700 space-y-4 leading-relaxed">
                    <p>請您留下15分鐘與自己獨處的時間，直覺的將看到問題的感受記錄下來即可，沒有正確答案，也沒有是非對錯。</p>
                    <p>放輕鬆，把心靜下來，舒服地、慢慢地專注在呼吸上。</p>
                    <p className="font-semibold text-[#8A9A87]">一切都會很好的。</p>
                </div>
                <div className="mt-8 flex flex-col items-center gap-4">
                     <button onClick={toggleMusic} className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600">
                        {isPlaying ? <icons.pause /> : <icons.play />}
                        <span>{isPlaying ? '暫停音樂' : '播放輕音樂'}</span>
                    </button>
                    <button onClick={() => onNavigate('questionnaire')} className="btn-primary">
                        我準備好了
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransitionPage; 