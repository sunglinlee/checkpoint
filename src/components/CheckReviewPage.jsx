import React, { useState, useMemo } from 'react';
import { icons } from './icons.jsx';

const Logo = () => (
  <div className="flex items-center gap-2">
    <img src="/logo/LOGO.png" alt="Check Point Logo" className="h-12 w-auto" />
    <img src="/logo/LOGO_H1.png" alt="Company Name" className="h-10 w-auto" />
  </div>
);

const CheckReviewPage = ({ onNavigate, user, questionnaireData }) => {
  const [expandedSections, setExpandedSections] = useState({});

  // 使用與 QuestionnairePage 相同的問題結構
  const questions = useMemo(() => [
    { id: 'satisfaction', icon: icons.satisfaction, title: '關於現在的生活', fields: [{ id: 'rating', type: 'scale', label: '您覺得當前的生活方式，有符合你想要活成的樣子嗎？ (1-10分)', options: { min: 1, max: 10, minLabel: '相差甚遠', maxLabel: '非常滿意' } }, { id: 'reason', type: 'textarea', label: '如果可以，也請記錄下給予這個分數的理由。' }] },
    { id: 'gratitude', icon: icons.gratitude, title: '感受美好的瞬間', fields: [{ id: 'grateful_events', type: 'textarea', label: '請快速記下最近發生的三件讓你心存感激/開心的小事，無論多麼微不足道。' }, { id: 'share_with', type: 'text', label: '關於這些開心的事情，會想要與誰分享呢？' }, { id: 'inspiration', type: 'textarea', label: '這些事情給你哪些影響或是啟發?' }] },
    { id: 'focus', icon: icons.focus, title: '你所關注的世界', fields: [{ id: 'current_events', type: 'textarea', label: '最近所關注的事件或是消息?' }, { id: 'feelings', type: 'textarea', label: '這些事件或消息讓你感覺如何?' }, { id: 'actions', type: 'textarea', label: '它會促使你執行哪些行動嗎?' }] },
    { id: 'emotion', icon: icons.emotion, title: '與情緒溫柔對話', fields: [{ id: 'emotion_event', type: 'textarea', label: '最近碰到讓你最不開心/無力/生氣的事情? 請將這個「情緒」視為一位來訪的信使。' }, { id: 'emotion_name', type: 'text', label: '如果它有名字，你會叫它什麼？' }, { id: 'unmet_needs', type: 'textarea', label: '它想告訴你，你有哪些需求沒有被滿足？' }] },
    { id: 'relations', icon: icons.relations, title: '你與身邊的連結', fields: [{ id: 'family', type: 'textarea', label: '關於家庭，你現在有什麼看法或感受？' }, { id: 'friends', type: 'textarea', label: '關於朋友，你現在有什麼看法或感受？' }, { id: 'love', type: 'textarea', label: '關於愛情，你現在有什麼看法或感受？' }] },
    { id: 'career', icon: icons.career, title: '工作與事業中的你', fields: [{ id: 'challenge', type: 'textarea', label: '請描述一個近期的挑戰。暫時不論結果，請專注於你在應對這個挑戰時，展現出了哪些過去未曾發現的『力量』或『特質』？' }, { id: 'new_understanding', type: 'textarea', label: '這個挑戰如何讓你對自己的能力有了新的認識？' }] },
    { id: 'desire', icon: icons.desire, title: '探索內心的渴望', fields: [{ id: 'dream', type: 'textarea', label: '拋開現實限制，如果你知道自己絕對不會失敗，你最想去嘗試的一件事是什麼？' }, { id: 'goal', type: 'textarea', label: '將它拆解成一個具體的、三個月內可實現的「目標」。這個目標是什麼？完成它的第一步又是什麼？' }] },
    { id: 'reflection', icon: icons.reflection, title: '回望與前行', fields: [{ id: 'forgiveness', type: 'textarea', label: '回顧過去的一個遺憾。如果可以給當時的自己寫一封信，你會選擇原諒自己，並告訴自己從中學到了什麼？' }, { id: 'future_self', type: 'textarea', label: '想對未來的自己說些什麼話?' }] },
    { id: 'mood_and_tags', icon: icons.gratitude, title: '此刻的心情與標記', fields: [{ id: 'snapshot_title', type: 'text', label: '為這個快照取個名字吧' }, { id: 'current_mood', type: 'options', label: '選擇最符合你此刻心情的狀態', options: ['平靜', '開心', '興奮', '溫暖', '焦慮但充滿希望', '沮喪', '其他'] }, { id: 'current_thoughts', type: 'textarea', label: '關於現在的你，有什麼特別想記錄下來的想法或感受？' }, { id: 'personal_tags', type: 'text', label: '為這個時刻添加 3-5 個標籤，用逗號分隔（例如：成長,反思,希望,轉變）' }] }
  ], []);

  // 模擬問卷答案數據 - 實際應用中這會從 props 或 API 獲取
  const mockAnswers = {
    rating: 7,
    reason: '整體來說還算滿意，但還有一些地方需要改進，特別是工作與生活的平衡。',
    grateful_events: '1. 今天早上看到陽光透過窗戶灑進來，感覺很溫暖\n2. 朋友主動關心我的近況\n3. 完成了一個困難的專案',
    share_with: '我的家人和最好的朋友',
    inspiration: '這些小事提醒我要珍惜當下，感恩身邊的人和事。',
    current_events: '最近關注氣候變遷和永續發展的議題',
    feelings: '有些擔憂但也充滿希望，覺得每個人都可以為地球盡一份力',
    actions: '開始減少使用一次性用品，多搭乘大眾運輸工具',
    emotion_event: '上週工作上的一個誤解讓我感到很沮喪和無力',
    emotion_name: '小灰',
    unmet_needs: '需要更多的理解和支持，以及更清楚的溝通',
    family: '家人是我最重要的支柱，雖然有時會有小摩擦，但愛是永恆的',
    friends: '朋友讓我的生活更豐富多彩，感謝有他們的陪伴',
    love: '正在學習如何更好地愛自己，也期待遇到對的人',
    challenge: '最近負責一個跨部門的專案，需要協調很多不同的意見',
    new_understanding: '發現自己比想像中更有耐心和溝通能力',
    dream: '想要開一間結合咖啡和書店的小店，創造一個溫暖的社區空間',
    goal: '三個月內完成商業計劃書，第一步是市場調研',
    forgiveness: '親愛的過去的自己，那次的失敗教會了你堅韌，你已經做得很好了',
    future_self: '希望你能保持現在的熱情，記得照顧好自己的身心健康',
    snapshot_title: '年末的反思時光',
    current_mood: '平靜',
    current_thoughts: '感覺自己正在慢慢成長，雖然路還很長，但每一步都很珍貴',
    personal_tags: '成長,反思,希望,平靜,感恩',
    snapshot_image: null,
    reminder_period: '3 個月'
  };

  const answers = questionnaireData || mockAnswers;

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
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
        return answer ? (
          <div className="w-full max-w-md">
            <img src={URL.createObjectURL(answer)} alt="上傳的圖片" className="w-full h-auto rounded-lg shadow-md" />
          </div>
        ) : <span className="text-gray-400 italic">未上傳圖片</span>;
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

  return (
    <div className="w-full min-h-screen bg-[#FDFCF9] text-[#3D4A4D]">
      {/* Header */}
      <header className="py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-sm z-10 border-b border-gray-200/50">
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
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {user?.nickname || user?.name || user?.given_name || '您'}的完整問答回顧
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            這是您完整的人生快照記錄，每一個答案都是您當時內心的真實寫照。
          </p>
        </div>

        {/* Questions and Answers */}
        <div className="space-y-6">
          {questions.map((question, index) => {
            const hasAnswers = question.fields.some(field => answers[field.id] !== undefined && answers[field.id] !== null && answers[field.id] !== '');
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
                            {renderAnswer(field, answers[field.id])}
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
          <h2 className="text-2xl font-bold text-center mb-6 text-[#5C6B68]">快照總結</h2>
          <div className="flex justify-center">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 text-center">個人標籤</h3>
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