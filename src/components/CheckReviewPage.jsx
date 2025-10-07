import React, { useState, useMemo, useEffect } from 'react';
import { icons } from './icons.jsx';
import { getSnapshotDetail } from '../api/snapshots';

const Logo = () => (
  <div className="flex items-center gap-2">
    <img src="https://storage.googleapis.com/checkpoint_frontend/logo/LOGO.png" alt="Check Point Logo" className="h-12 w-auto" />
    <img src="https://storage.googleapis.com/checkpoint_frontend/logo/LOGO_H1.png" alt="Company Name" className="h-10 w-auto" />
  </div>
);

const CheckReviewPage = ({ onNavigate, user, questionnaireData }) => {
  const [expandedSections, setExpandedSections] = useState({});
  const [answers, setAnswers] = useState(questionnaireData || null);
  const [isLoading, setIsLoading] = useState(!questionnaireData);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 使用與 QuestionnairePage 相同的問題結構
  const questions = useMemo(() => [
    { id: 'satisfaction', icon: icons.satisfaction, title: '關於現在的生活', fields: [{ id: 'rating', type: 'scale', label: '您覺得當前的生活方式，有符合你想要活成的樣子嗎？ (1-10分)', options: { min: 1, max: 10, minLabel: '相差甚遠', maxLabel: '非常滿意' } }, { id: 'reason', type: 'textarea', label: '如果可以，也請記錄下給予這個分數的理由。' }] },
    { id: 'gratitude', icon: icons.gratitude, title: '感受美好的瞬間', fields: [{ id: 'grateful_events', type: 'textarea', label: '請快速記下最近發生的三件讓你心存感激/開心的小事，無論多麼微不足道。' }, { id: 'share_with', type: 'text', label: '關於這些開心的事情，會想要與誰分享呢？' }, { id: 'inspiration', type: 'textarea', label: '這些事情給你哪些影響或是啟發?' }] },
    { id: 'focus', icon: icons.focus, title: '你所關注的世界', fields: [{ id: 'current_events', type: 'textarea', label: '最近所關注的事件或是消息?' }, { id: 'feelings', type: 'textarea', label: '這些事件或消息讓你感覺如何?' }, { id: 'actions', type: 'textarea', label: '它會促使你執行哪些行動嗎?' }] },
    { id: 'emotion', icon: icons.emotion, title: '與情緒溫柔對話', fields: [{ id: 'emotion_event', type: 'textarea', label: '最近碰到讓你最不開心/無力/生氣的事情? 請將這個「情緒」視為一位來訪的信使。' }, { id: 'emotion_name', type: 'text', label: '如果它有名字，你會叫它什麼？' }, { id: 'unmet_needs', type: 'textarea', label: '它想告訴你，你有哪些需求沒有被滿足？' }] },
    { id: 'relations', icon: icons.relations, title: '你與身邊的連結', fields: [{ id: 'overall_perspective', type: 'textarea', label: '對於自己身邊的一切（人、環境、氛圍），你現在有什麼看法？' }, { id: 'family', type: 'textarea', label: '關於家庭，你現在有什麼看法或感受？' }, { id: 'friends', type: 'textarea', label: '關於朋友，你現在有什麼看法或感受？' }, { id: 'love', type: 'textarea', label: '關於愛情，你現在有什麼看法或感受？' }] },
    { id: 'career', icon: icons.career, title: '工作與事業中的你', fields: [{ id: 'challenge_description', type: 'textarea', label: '最近在事業上，你遇到的一個挑戰是什麼？（不必強調結果，專注在你的表現與特質）' }, { id: 'discovered_strengths', type: 'textarea', label: '在應對這個挑戰的過程中，你發現了自己有哪些新的力量或特質？' }, { id: 'changed_perspective', type: 'textarea', label: '這個挑戰如何改變你對自己的看法或能力的認識？' }] },
    { id: 'desire', icon: icons.desire, title: '探索內心的渴望', fields: [{ id: 'unrestricted_dream', type: 'textarea', label: '如果拋開現實限制，你最想去嘗試的一件事是什麼？' }, { id: 'three_month_goal', type: 'textarea', label: '把這個夢想縮小到三個月內，你能設定的一個具體目標是什麼？' }, { id: 'first_step', type: 'textarea', label: '完成這個目標的第一步是什麼？' }, { id: 'action_willingness', type: 'scale', label: '在 1–10 分之間，你有多大的意願為這個渴望有所行動？', options: { min: 1, max: 10, minLabel: '1 (沒太多意願)', maxLabel: '10 (想要立刻行動)', midLabel: '5 (等待合適的時機)' } }] },
    { id: 'reflection', icon: icons.reflection, title: '回望與前行', fields: [{ id: 'forgiveness', type: 'textarea', label: '回顧過去的一個遺憾。如果可以給當時的自己寫一封信，你會選擇原諒自己，並告訴自己從中學到了什麼？' }, { id: 'future_self', type: 'textarea', label: '想對未來的自己說些什麼話?' }] },
    { id: 'mood_and_tags', icon: icons.gratitude, title: '此刻的心情與標記', fields: [{ id: 'snapshot_title', type: 'text', label: '為這個快照取個名字吧' }, { id: 'current_mood', type: 'options', label: '選擇最符合你此刻心情的狀態', options: ['平靜', '開心', '興奮', '溫暖', '焦慮但充滿希望', '沮喪', '其他'] }, { id: 'current_thoughts', type: 'textarea', label: '關於現在的你，有什麼特別想記錄下來的想法或感受？' }] }
  ], []);

  useEffect(() => {
    let mounted = true;

    // 若父層已提供資料，直接使用
    if (questionnaireData) {
      setAnswers(questionnaireData);
      setIsLoading(false);
      setErrorMessage('');
      return;
    }

    const loadSnapshot = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');
        let snapshotId = null;
        try {
          snapshotId = typeof window !== 'undefined' ? window.sessionStorage.getItem('selectedSnapshotId') : null;
        } catch {}
        if (!snapshotId) {
          throw new Error('找不到快照 ID，請從列表重新進入');
        }
        const resp = await getSnapshotDetail(snapshotId);
        const rawData = resp?.data ?? resp; // 兼容不同層包裝
        let data = rawData;
        if (typeof data === 'string') {
          try { data = JSON.parse(data); } catch {}
        }
        const qa = data?.questionnaire_data || {};
        const meta = data?.metadata || {};

        // 將後端的問卷結構與中繼資料攤平成本頁所需的扁平 key
        const flattened = {};
        // 1) 攤平成各 section 的欄位
        Object.keys(qa || {}).forEach((sectionKey) => {
          const section = qa[sectionKey];
          if (section && typeof section === 'object') {
            Object.keys(section).forEach((fieldKey) => {
              flattened[fieldKey] = section[fieldKey];
            });
          }
        });
        // 2) 從 metadata 對應到 UI 期待的欄位
        if (meta.title) flattened.snapshot_title = meta.title;
        if (meta.mood) flattened.current_mood = meta.mood;
        if (meta.content) flattened.current_thoughts = meta.content;
        if (Array.isArray(meta.tags)) {
          flattened.personal_tags = meta.tags.join(',');
        } else if (typeof meta.tags === 'string') {
          flattened.personal_tags = meta.tags;
        }
        if (meta.reminder_period) flattened.reminder_period = meta.reminder_period;
        // snapshot_image: 若有 URL，先保留 URL 供顯示（本頁不強制以 File 呈現）
        if (meta.image_url) flattened.snapshot_image = meta.image_url;

        if (!mounted) return;
        setAnswers(flattened);
      } catch (err) {
        if (!mounted) return;
        console.error('載入快照詳情失敗:', err);
        setErrorMessage(err?.message || '載入失敗');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadSnapshot();
    return () => { mounted = false; };
  }, [questionnaireData]);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleDropdownAction = (action) => {
    setIsDropdownOpen(false);
    if (action === 'home') {
      onNavigate('home');
    } else if (action === 'review') {
      onNavigate('review');
    } else if (action === 'questionnaire') {
      onNavigate('questionnaire');
    }
  };

  const renderAnswer = (field, answer) => {
    if (!answer && answer !== 0) return <span className="text-gray-400 italic">未填寫</span>;

    switch (field.type) {
      case 'scale':
        return (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[#8A9A87]">{answer}</span>
              <span className="text-gray-600">/ {field.options.max}</span>
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-[#8A9A87] h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(answer / field.options.max) * 100}%` }}
              ></div>
            </div>
          </div>
        );
      case 'textarea':
        return (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{answer}</p>
          </div>
        );
      case 'text':
        return <p className="text-gray-700 font-medium">{answer}</p>;
      case 'options':
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
          return (
            <div className="flex items-center gap-2">
              <span className="text-2xl">{moodEmojis[answer]}</span>
              <span className="text-lg font-medium text-[#8A9A87]">{answer}</span>
            </div>
          );
        }
        return <span className="px-3 py-1 bg-[#8A9A87] text-white rounded-full text-sm">{answer}</span>;
      case 'image':
        if (!answer) return <span className="text-gray-400 italic">未上傳圖片</span>;
        // 支援 File 或 URL 兩種格式
        const src = typeof answer === 'string' ? answer : URL.createObjectURL(answer);
        return (
          <div className="w-full max-w-md">
            <img src={src} alt="上傳的圖片" className="w-full h-auto rounded-lg shadow-md" />
          </div>
        );
      default:
        return <span className="text-gray-700">{answer}</span>;
    }
  };

  const getMoodColor = (mood) => {
    const moodColors = {
      '平靜': 'from-blue-100 to-blue-50',
      '開心': 'from-green-100 to-green-50',
      '興奮': 'from-pink-100 to-pink-50',
      '溫暖': 'from-orange-100 to-orange-50',
      '焦慮但充滿希望': 'from-yellow-100 to-yellow-50',
      '沮喪': 'from-gray-100 to-gray-50',
      '其他': 'from-purple-100 to-purple-50'
    };
    return moodColors[mood] || 'from-gray-100 to-gray-50';
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#FDFCF9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8A9A87] mx-auto mb-4"></div>
          <p className="text-gray-600">載入快照詳情中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FDFCF9] text-[#3D4A4D]">
      {/* Header - Mobile Optimized with Dropdown */}
      <header className="py-3 px-4 md:py-4 md:px-12 sticky top-0 bg-white/90 backdrop-blur-sm z-10 border-b border-gray-200/50">
        {/* Mobile Layout: Logo left, dropdown menu right */}
        <div className="md:hidden flex justify-between items-center">
          <a href="#" onClick={e => { e.preventDefault(); onNavigate('home'); }}>
            <Logo />
          </a>
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-2 rounded-full bg-[#8A9A87] text-white hover:bg-[#7A8A77] transition-colors"
              aria-label="選單"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-30">
                <button 
                  onClick={() => handleDropdownAction('home')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  返回首頁
                </button>
                <button 
                  onClick={() => handleDropdownAction('review')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  返回列表
                </button>
                <button 
                  onClick={() => handleDropdownAction('questionnaire')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  新增快照
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Desktop Layout: Logo left, buttons right */}
        <div className="hidden md:flex justify-between items-center">
          <a href="#" onClick={e => { e.preventDefault(); onNavigate('home'); }}>
            <Logo />
          </a>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('review')}
              className="px-4 py-2 rounded-full bg-gray-500 text-white text-sm font-semibold hover:bg-gray-600 transition-colors"
            >
              返回快照列表
            </button>
            <button 
              onClick={() => onNavigate('home')}
              className="px-4 py-2 rounded-full bg-[#8A9A87] text-white text-sm font-semibold hover:bg-[#7A8A77] transition-colors"
            >
              返回首頁
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop to close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-20" 
          onClick={() => setIsDropdownOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {user?.nickname || user?.name || user?.given_name || '您'}的完整問答回顧
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            這是您完整的人生快照記錄，每一個答案都是您當時內心的真實寫照。
          </p>
          {errorMessage && (
            <p className="text-red-500 mt-4">{errorMessage}</p>
          )}
        </div>

        {/* Questions and Answers */}
        <div className="space-y-6">
          {questions.map((question, index) => {
            const hasAnswers = question.fields.some(field => answers && answers[field.id] !== undefined && answers[field.id] !== null && answers[field.id] !== '');
            const isExpanded = expandedSections[question.id] !== false; // 默認展開
            const CurrentIcon = question.icon;

            return (
              <div key={question.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50/50 transition-colors"
                  onClick={() => toggleSection(question.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#F9F7F2] rounded-full flex items-center justify-center flex-shrink-0">
                        <CurrentIcon />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-[#5C6B68]">{question.title}</h2>
                        <p className="text-sm text-gray-500">第 {index + 1} 部分</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg 
                        className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    <div className="space-y-6 pt-6">
                      {question.fields.map((field) => (
                        <div key={field.id} className="space-y-3">
                          <h3 className="text-lg font-medium text-gray-800">{field.label}</h3>
                          <div className="pl-4 border-l-4 border-[#8A9A87]/30">
                            {renderAnswer(field, answers ? answers[field.id] : undefined)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary Section */}
        <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8">
          {/*
          <h2 className="text-2xl font-bold text-center mb-6 text-[#5C6B68]">快照總結</h2>
          */}
          <div className="flex justify-center">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 text-center">快照標籤</h3>
              {answers.personal_tags ? (
                <div className="flex flex-wrap gap-2 justify-center">
                  {answers.personal_tags.split(',').map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-[#8A9A87] text-white rounded-full text-sm">
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-400 italic">未設定標籤</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button 
            onClick={() => onNavigate('questionnaire')}
            className="px-6 py-3 bg-[#8A9A87] text-white rounded-full font-semibold hover:bg-[#7A8A77] transition-colors"
          >
            開始新的快照
          </button>
          <button 
            onClick={() => onNavigate('review')}
            className="px-6 py-3 bg-white text-[#8A9A87] border-2 border-[#8A9A87] rounded-full font-semibold hover:bg-[#8A9A87] hover:text-white transition-colors"
          >
            查看所有快照
          </button>
        </div>
      </main>
    </div>
  );
};

export default CheckReviewPage;

//更新阿