import React, { useState, useMemo } from 'react';
import { buildQaPayload } from '../utils/buildQaPayload';
import { submitQuestionnaire } from '../api/questionnaire';
import { icons } from './icons.jsx';

const QuestionnairePage = ({ onNavigate }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [imagePreview, setImagePreview] = useState(null);

    const questions = useMemo(() => [
        { id: 'satisfaction', icon: icons.satisfaction, title: '關於現在的生活', fields: [{ id: 'rating', type: 'scale', label: '您覺得當前的生活方式，有符合你想要活成的樣子嗎？ (1-10分)', options: { min: 1, max: 10, minLabel: '相差甚遠', maxLabel: '非常滿意' } }, { id: 'reason', type: 'textarea', label: '如果可以，也請記錄下給予這個分數的理由。' }] },
        { id: 'gratitude', icon: icons.gratitude, title: '感受美好的瞬間', fields: [{ id: 'grateful_events', type: 'textarea', label: '請快速記下最近發生的三件讓你心存感激/開心的小事，無論多麼微不足道。' }, { id: 'share_with', type: 'text', label: '關於這些開心的事情，會想要與誰分享呢？' }, { id: 'inspiration', type: 'textarea', label: '這些事情給你哪些影響或是啟發?' }] },
        { id: 'focus', icon: icons.focus, title: '你所關注的世界', fields: [{ id: 'current_events', type: 'textarea', label: '最近所關注的事件或是消息?' }, { id: 'feelings', type: 'textarea', label: '這些事件或消息讓你感覺如何?' }, { id: 'actions', type: 'textarea', label: '它會促使你執行哪些行動嗎?' }] },
        { id: 'emotion', icon: icons.emotion, title: '與情緒溫柔對話', fields: [{ id: 'emotion_event', type: 'textarea', label: '最近碰到讓你最不開心/無力/生氣的事情? 請將這個「情緒」視為一位來訪的信使。' }, { id: 'emotion_name', type: 'text', label: '如果它有名字，你會叫它什麼？' }, { id: 'unmet_needs', type: 'textarea', label: '它想告訴你，你有哪些需求沒有被滿足？' }] },
        { id: 'relations', icon: icons.relations, title: '你與身邊的連結', fields: [{ id: 'family', type: 'textarea', label: '關於家庭，你現在有什麼看法或感受？' }, { id: 'friends', type: 'textarea', label: '關於朋友，你現在有什麼看法或感受？' }, { id: 'love', type: 'textarea', label: '關於愛情，你現在有什麼看法或感受？' }] },
        { id: 'career', icon: icons.career, title: '工作與事業中的你', fields: [{ id: 'challenge', type: 'textarea', label: '請描述一個近期的挑戰。暫時不論結果，請專注於你在應對這個挑戰時，展現出了哪些過去未曾發現的『力量』或『特質』？' }, { id: 'new_understanding', type: 'textarea', label: '這個挑戰如何讓你對自己的能力有了新的認識？' }] },
        { id: 'desire', icon: icons.desire, title: '探索內心的渴望', fields: [{ id: 'dream', type: 'textarea', label: '拋開現實限制，如果你知道自己絕對不會失敗，你最想去嘗試的一件事是什麼？' }, { id: 'goal', type: 'textarea', label: '將它拆解成一個具體的、三個月內可實現的「目標」。這個目標是什麼？完成它的第一步又是什麼？' }] },
        { id: 'reflection', icon: icons.reflection, title: '回望與前行', fields: [{ id: 'forgiveness', type: 'textarea', label: '回顧過去的一個遺憾。如果可以給當時的自己寫一封信，你會選擇原諒自己，並告訴自己從中學到了什麼？' }, { id: 'future_self', type: 'textarea', label: '想對未來的自己說些什麼話?' }] },
        { id: 'mood_and_tags', icon: icons.gratitude, title: '此刻的心情與標記', fields: [{ id: 'snapshot_title', type: 'text', label: '為這個快照取個名字吧' }, { id: 'current_mood', type: 'options', label: '選擇最符合你此刻心情的狀態', options: ['平靜', '開心', '興奮', '溫暖', '焦慮但充滿希望', '沮喪', '其他'] }, { id: 'current_thoughts', type: 'textarea', label: '關於現在的你，有什麼特別想記錄下來的想法或感受？' }, { id: 'personal_tags', type: 'text', label: '為這個時刻添加 3-5 個標籤，用逗號分隔（例如：成長,反思,希望,轉變）' }] },
        { id: 'schedule', icon: icons.schedule, title: '預約下一封時空信', fields: [{ id: 'reminder_period', type: 'options', label: '希望多久之後收到這份紀錄，並重新填寫呢？', options: ['1 個月', '3 個月', '6 個月'] }] },
        { id: 'complete', icon: icons.complete, title: '完成了，真棒！', fields: [] }
    ], []);

    const handleAnswerChange = (fieldId, value) => setAnswers(prev => ({ ...prev, [fieldId]: value }));
    
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            handleAnswerChange('snapshot_image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
    
    const handleNext = async () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // 組裝 qa 結構並暫存
            try {
                const payload = buildQaPayload(answers);
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem('lastQaPayload', JSON.stringify(payload));
                }
                // 供開發偵錯
                // eslint-disable-next-line no-console
                console.log('QA payload:', payload);
                // 送出問卷
                try {
                    await submitQuestionnaire(payload);
                    // eslint-disable-next-line no-console
                    console.log('問卷已送出');
                } catch (submitError) {
                    // eslint-disable-next-line no-console
                    console.error('問卷送出失敗:', submitError);
                }
            } catch {}
            // 跳轉到首頁
            onNavigate && onNavigate('home');
        }
    };
    const handlePrev = () => currentStep > 0 && setCurrentStep(currentStep - 1);

    const progress = ((currentStep + 1) / questions.length) * 100;
    const CurrentIcon = questions[currentStep].icon;

    return (
        <div className="bg-[#FDFCF9] min-h-screen w-full flex flex-col items-center justify-center p-4 text-[#3D4A4D]">
            <div className="w-full max-w-2xl mx-auto">
                <div className="mb-4">
                    <div className="bg-[#F3F0E9] rounded-full h-2">
                        <div className="bg-[#8A9A87] h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-sm text-right mt-1 text-gray-500">進度 {currentStep + 1} / {questions.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 transition-all duration-300">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 mx-auto bg-[#F9F7F2] rounded-full flex items-center justify-center mb-4">
                            <CurrentIcon />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-[#5C6B68]">{questions[currentStep].title}</h2>
                    </div>
                    <div className="space-y-6">
                        {questions[currentStep].id !== 'complete' ? questions[currentStep].fields.map(field => (
                            <div key={field.id}>
                                <label className="block text-lg mb-2 text-gray-700">{field.label}</label>
                                {field.type === 'text' && <input type="text" value={answers[field.id] || ''} onChange={e => handleAnswerChange(field.id, e.target.value)} className="input-field" />}
                                {field.type === 'textarea' && <textarea rows="5" value={answers[field.id] || ''} onChange={e => handleAnswerChange(field.id, e.target.value)} className="textarea-field" />}
                                {field.type === 'scale' && (
                                    <div>
                                        <div className="flex justify-between items-center gap-1 md:gap-2 flex-wrap">
                                            {Array.from({ length: field.options.max }, (_, i) => i + 1).map(num => (
                                                <button key={num} onClick={() => handleAnswerChange(field.id, num)} className={`w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full transition text-sm ${answers[field.id] === num ? 'bg-[#8A9A87] text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>{num}</button>
                                            ))}
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                                            <span>{field.options.minLabel}</span>
                                            <span>{field.options.maxLabel}</span>
                                        </div>
                                    </div>
                                )}
                                {field.type === 'image' && (
                                    <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 relative">
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                        {imagePreview ? <img src={imagePreview} alt="預覽" className="w-full h-full object-contain rounded-lg p-1" /> : <span className="text-gray-500">點擊此處上傳</span>}
                                    </div>
                                )}
                                {field.type === 'options' && (
                                    <div className={field.id === 'current_mood' ? 'grid grid-cols-2 md:grid-cols-3 gap-3' : 'flex flex-col md:flex-row gap-4'}>
                                        {field.options.map(opt => {
                                            if (field.id === 'current_mood') {
                                                const moodEmojis = {
                                                    '平靜': '😌',
                                                    '開心': '😊',
                                                    '興奮': '🤩',
                                                    '溫暖': '🥰',
                                                    '焦慮但充滿希望': '😰',
                                                    '沮喪': '😔',
                                                    '其他': '🤔'
                                                };
                                                const moodColors = {
                                                    '平靜': 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-800',
                                                    '開心': 'bg-green-50 border-green-200 hover:bg-green-100 text-green-800',
                                                    '興奮': 'bg-pink-50 border-pink-200 hover:bg-pink-100 text-pink-800',
                                                    '溫暖': 'bg-orange-50 border-orange-200 hover:bg-orange-100 text-orange-800',
                                                    '焦慮但充滿希望': 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100 text-yellow-800',
                                                    '沮喪': 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-800',
                                                    '其他': 'bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-800'
                                                };
                                                const selectedStyle = answers[field.id] === opt ? 'bg-[#8A9A87] text-white border-[#8A9A87] shadow-md transform scale-105' : moodColors[opt];
                                                return (
                                                    <button 
                                                        key={opt} 
                                                        onClick={() => handleAnswerChange(field.id, opt)} 
                                                        className={`p-4 border-2 rounded-xl transition-all duration-200 text-center flex flex-col items-center gap-2 ${selectedStyle}`}
                                                    >
                                                        <span className="text-2xl">{moodEmojis[opt]}</span>
                                                        <span className="text-sm font-medium">{opt}</span>
                                                    </button>
                                                );
                                            } else {
                                                return (
                                                    <button key={opt} onClick={() => handleAnswerChange(field.id, opt)} className={`flex-1 p-4 border rounded-lg transition text-center ${answers[field.id] === opt ? 'bg-[#8A9A87] text-white border-[#8A9A87]' : 'bg-white hover:bg-gray-50 border-gray-300'}`}>{opt}</button>
                                                );
                                            }
                                        })}
                                    </div>
                                )}
                            </div>
                        )) : (
                            <div className="text-center text-lg text-gray-700 space-y-4">
                                <p>你的「人生快照」已經安全地封存。</p>
                                <p>在你設定的時間，我們會將這份珍貴的紀錄送到你的信箱，邀請你回來看看自己，並開啟下一次的對話。</p>
                                <p>感謝你願意花時間，溫柔地對待自己。</p>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between mt-12">
                        <button onClick={handlePrev} disabled={currentStep === 0} className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed">上一步</button>
                        <button onClick={handleNext} className="px-6 py-2 rounded-full bg-[#8A9A87] text-white hover:bg-[#738370] transition">{currentStep === questions.length - 1 ? '完成' : '下一步'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionnairePage; 