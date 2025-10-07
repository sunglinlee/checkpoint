import React, { useState, useMemo } from 'react';
import { buildQaPayload } from '../utils/buildQaPayload';
import { submitQuestionnaire } from '../api/questionnaire';
import { icons } from './icons.jsx';

const QuestionnairePage = ({ onNavigate }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});

    const questions = useMemo(() => [
        { id: 'satisfaction', icon: icons.satisfaction, title: '關於現在的生活', fields: [{ id: 'rating', type: 'scale', label: '在 1–10 分之間，你覺得目前的生活與理想中的自己有多接近？', options: { min: 1, max: 10, minLabel: '1 (差距很大)', maxLabel: '10 (非常接近)', midLabel: '5 (還可以)' } }, { id: 'reason', type: 'textarea', label: '你給這個分數的原因是什麼？如果能改善一點點，你希望是哪個部分？' }] },
        { id: 'gratitude', icon: icons.gratitude, title: '感受美好的瞬間', fields: [{ id: 'grateful_events', type: 'textarea', label: '最近發生的三件讓你心存感激/開心的小事是什麼？無論多麼微不足道都可以。' }, { id: 'share_with', type: 'text', label: '關於這些開心的事情，會想要與誰分享呢？' }, { id: 'inspiration', type: 'textarea', label: '這些事情給你哪些影響或是啟發?' }] },
        { id: 'focus', icon: icons.focus, title: '你所關注的世界', fields: [{ id: 'current_events', type: 'textarea', label: '最近讓你最關注的事件或消息是什麼？' }, { id: 'feelings', type: 'textarea', label: '這些事件或消息讓你感覺如何?' }, { id: 'actions', type: 'textarea', label: '它是否促使你想採取某些行動？是什麼行動？' }] },
        { id: 'emotion', icon: icons.emotion, title: '與情緒溫柔對話', fields: [{ id: 'emotion_event', type: 'textarea', label: '最近一次讓你感到最不開心、無力或生氣的情境是什麼？' }, { id: 'emotion_name', type: 'text', label: '這個情緒想告訴你什麼？背後有哪些需求沒有被滿足？' }, { id: 'unmet_needs', type: 'textarea', label: '你想要／已經怎麼做來回應這個情緒？' }] },
        { id: 'relations', icon: icons.relations, title: '你與身邊的連結', fields: [{ id: 'overall_perspective', type: 'textarea', label: '對於自己身邊的一切（人、環境、氛圍），你現在有什麼看法？' }, { id: 'family', type: 'textarea', label: '關於家庭，你現在有什麼看法或感受？' }, { id: 'friends', type: 'textarea', label: '關於朋友，你現在有什麼看法或感受？' }, { id: 'love', type: 'textarea', label: '關於愛情，你現在有什麼看法或感受？' }] },
        { id: 'career', icon: icons.career, title: '工作與事業中的你', fields: [{ id: 'challenge_description', type: 'textarea', label: '最近在事業上，你遇到的一個挑戰是什麼？（不必強調結果，專注在你的表現與特質）' }, { id: 'discovered_strengths', type: 'textarea', label: '在應對這個挑戰的過程中，你發現了自己有哪些新的力量或特質？' }, { id: 'changed_perspective', type: 'textarea', label: '這個挑戰如何改變你對自己的看法或能力的認識？' }] },
        { id: 'desire', icon: icons.desire, title: '探索內心的渴望', fields: [{ id: 'unrestricted_dream', type: 'textarea', label: '如果拋開現實限制，你最想去嘗試的一件事是什麼？' }, { id: 'three_month_goal', type: 'textarea', label: '把這個夢想縮小到三個月內，你能設定的一個具體目標是什麼？' }, { id: 'first_step', type: 'textarea', label: '完成這個目標的第一步是什麼？' }, { id: 'action_willingness', type: 'scale', label: '在 1–10 分之間，你有多大的意願為這個渴望有所行動？', options: { min: 1, max: 10, minLabel: '1 (沒太多意願)', maxLabel: '10 (想要立刻行動)', midLabel: '5 (等待合適的時機)' } }] },
        { id: 'reflection', icon: icons.reflection, title: '回望與前行', fields: [{ id: 'forgiveness', type: 'textarea', label: '回顧過去的一個遺憾，如果能給當時的自己寫一封信，你會怎麼安慰他／她？' }, { id: 'future_self', type: 'textarea', label: '對於未來的自己，你最想說的一句話是什麼？' }] },
        { id: 'mood_and_tags', icon: icons.gratitude, title: '此刻的心情與標記', fields: [{ id: 'snapshot_title', type: 'text', label: '為這個快照取個名字吧' }, { id: 'current_mood', type: 'options', label: '選擇最符合你此刻心情的狀態', options: ['平靜', '開心', '興奮', '溫暖', '焦慮但充滿希望', '沮喪', '其他'] }, { id: 'current_thoughts', type: 'textarea', label: '關於現在的你，有什麼特別想記錄下來的想法或感受？' }, { id: 'personal_tags', type: 'text', label: '為這個時刻添加 3-5 個標籤，用逗號分隔（例如：成長,反思,希望,轉變）' }] },
        { id: 'schedule', icon: icons.schedule, title: '預約下一封時空信', fields: [{ id: 'reminder_period', type: 'options', label: '希望多久之後收到這份紀錄，並重新填寫呢？', options: ['1 個月', '3 個月', '6 個月'] }] },
        { id: 'complete', icon: icons.complete, title: '完成了，真棒！', fields: [] }
    ], []);

    const handleAnswerChange = (fieldId, value) => {
        setAnswers(prev => ({ ...prev, [fieldId]: value }));
        setErrors(prev => ({ ...prev, [fieldId]: undefined }));
    };
    
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            handleAnswerChange('snapshot_image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
    
    const validateStep = (stepIndex) => {
        const step = questions[stepIndex];
        if (!step || step.id === 'complete') return true;
        const newErrors = {};
        (step.fields || []).forEach(field => {
            const value = answers[field.id];
            if (field.type === 'text' || field.type === 'textarea') {
                if (!value || String(value).trim().length === 0) newErrors[field.id] = '此欄位為必填';
            } else if (field.type === 'scale') {
                if (value === undefined || value === null || value === '') newErrors[field.id] = '請選擇一個分數';
            } else if (field.type === 'options') {
                if (!value) newErrors[field.id] = '請選擇一個日期';
            } else if (field.type === 'image') {
                if (!value) newErrors[field.id] = '請上傳圖片';
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = async () => {
        if (!validateStep(currentStep)) return;
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
                        
                        {/* 題目說明文字 */}
                        {questions[currentStep].id === 'satisfaction' && (
                            <div className="mt-6">
                                <div className="max-w-lg mx-auto">
                                    <p className="text-[#5C6B68] leading-relaxed text-sm italic">
                                        "這就像是幫自己照照鏡子。別急著評價好壞，只要誠實看看「我現在過得像我想要的樣子嗎？」。誠實地回答，不必苛求完美，因為意識到差距，本身就是成長的第一步。"
                                    </p>
                                </div>
                            </div>
                        )}
                        {questions[currentStep].id === 'gratitude' && (
                            <div className="mt-6">
                                <div className="max-w-lg mx-auto">
                                    <p className="text-[#5C6B68] leading-relaxed text-sm italic">
                                        "當我們有意識地記錄生活中的小確幸，它們會逐漸放大，讓生活更有力量。有時候幸福藏在最不起眼的細節裡。這一題是想邀請你停下來，回想那些讓你微笑的瞬間。"
                                    </p>
                                </div>
                            </div>
                        )}
                        {questions[currentStep].id === 'focus' && (
                            <div className="mt-6">
                                <div className="max-w-lg mx-auto">
                                    <p className="text-[#5C6B68] leading-relaxed text-sm italic">
                                        "我們所關注的世界事件，往往反映了我們的價值觀與內在需求。可以幫助覺察外在訊息如何影響我們的內心。"
                                    </p>
                                </div>
                            </div>
                        )}
                        {questions[currentStep].id === 'emotion' && (
                            <div className="mt-6">
                                <div className="max-w-lg mx-auto">
                                    <p className="text-[#5C6B68] leading-relaxed text-sm italic">
                                        "情緒是來訪的信使，它們不是敵人，有時候，情緒只是想被你聽見。別急著壓下來，請試著理解「它想告訴我什麼」。"
                                    </p>
                                </div>
                            </div>
                        )}
                        {questions[currentStep].id === 'relations' && (
                            <div className="mt-6">
                                <div className="max-w-lg mx-auto">
                                    <p className="text-[#5C6B68] leading-relaxed text-sm italic">
                                        "我們的生活品質，往往來自與人際關係的互動。更全面的檢視自己與家庭、朋友、愛情的連結，覺察其中的支持與需求。"
                                    </p>
                                </div>
                            </div>
                        )}
                        {questions[currentStep].id === 'career' && (
                            <div className="mt-6">
                                <div className="max-w-lg mx-auto">
                                    <p className="text-[#5C6B68] leading-relaxed text-sm italic">
                                        "挑戰能幫助我們看到自己未曾發現的力量。以不同的視角察覺自己在事業上的成長。"
                                    </p>
                                </div>
                            </div>
                        )}
                        {questions[currentStep].id === 'desire' && (
                            <div className="mt-6">
                                <div className="max-w-lg mx-auto">
                                    <p className="text-[#5C6B68] leading-relaxed text-sm italic">
                                        "這一題是給夢想一點空間。先別管現實的限制，純粹想想：「如果我可以，我最想做什麼？」"
                                    </p>
                                </div>
                            </div>
                        )}
                        {questions[currentStep].id === 'reflection' && (
                            <div className="mt-6">
                                <div className="max-w-lg mx-auto">
                                    <p className="text-[#5C6B68] leading-relaxed text-sm italic">
                                        "回顧過去能帶來釋懷，展望未來能帶來希望。與過去的自己和解，並給未來的自己鼓勵。"
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="space-y-6">
                        {questions[currentStep].id !== 'complete' ? questions[currentStep].fields.map(field => (
                            <div key={field.id}>
                                <label className="block text-lg mb-2 text-gray-700">{field.label} <span className="text-red-500">*</span></label>
                                {field.type === 'text' && <input type="text" value={answers[field.id] || ''} onChange={e => handleAnswerChange(field.id, e.target.value)} className={`input-field ${errors[field.id] ? 'border-red-400 focus:border-red-500' : ''}`} />}
                                {field.type === 'textarea' && <textarea rows="5" value={answers[field.id] || ''} onChange={e => handleAnswerChange(field.id, e.target.value)} className={`textarea-field ${errors[field.id] ? 'border-red-400 focus:border-red-500' : ''}`} />}
                                {field.type === 'scale' && (
                                    <div>
                                        {/* 桌面端：一排顯示 */}
                                        <div className="hidden md:block">
                                            <div className="flex justify-between items-center gap-2">
                                                {Array.from({ length: field.options.max }, (_, i) => i + 1).map(num => (
                                                    <button key={num} onClick={() => handleAnswerChange(field.id, num)} className={`w-10 h-10 flex items-center justify-center rounded-full transition text-sm ${answers[field.id] === num ? 'bg-[#8A9A87] text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>{num}</button>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        {/* 手機端：兩排顯示 */}
                                        <div className="md:hidden space-y-3">
                                            {/* 第一排：1-5 */}
                                            <div className="flex justify-between items-center gap-2">
                                                {Array.from({ length: 5 }, (_, i) => i + 1).map(num => (
                                                    <button key={num} onClick={() => handleAnswerChange(field.id, num)} className={`w-10 h-10 flex items-center justify-center rounded-full transition text-sm ${answers[field.id] === num ? 'bg-[#8A9A87] text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>{num}</button>
                                                ))}
                                            </div>
                                            {/* 第二排：6-10 */}
                                            <div className="flex justify-between items-center gap-2">
                                                {Array.from({ length: 5 }, (_, i) => i + 6).map(num => (
                                                    <button key={num} onClick={() => handleAnswerChange(field.id, num)} className={`w-10 h-10 flex items-center justify-center rounded-full transition text-sm ${answers[field.id] === num ? 'bg-[#8A9A87] text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>{num}</button>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-between text-xs md:text-sm text-gray-500 mt-3 px-1">
                                            <span className="text-left flex-1">{field.options.minLabel}</span>
                                            {field.options.midLabel && (
                                                <span className="text-center flex-1">{field.options.midLabel}</span>
                                            )}
                                            <span className="text-right flex-1">{field.options.maxLabel}</span>
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
                                {errors[field.id] && (
                                    <p className="mt-2 text-sm text-red-600">{errors[field.id]}</p>
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