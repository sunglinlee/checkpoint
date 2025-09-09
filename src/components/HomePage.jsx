import React, { useState, useEffect, useRef } from 'react';
import HomePageVideo from "./HomePageVideo";
import { changePassword, updateNickname } from '../api/auth';

const CssIconCheck = () => (
  <div className="inline-block w-6 h-6 bg-[#8A9A87] rounded-full relative flex-shrink-0">
    <span className="absolute left-[0.5rem] top-[0.25rem] w-2 h-3.5 border-solid border-white border-r-[3px] border-b-[3px] transform rotate-45"></span>
  </div>
);

const Logo = () => (
  <div className="flex items-center gap-2">
    <img src="/logo/LOGO.png" alt="Check Point Logo" className="h-12 w-auto" />
    <img src="/logo/LOGO_H1.png" alt="Company Name" className="h-10 w-auto" />
  </div>
);


const HomePage = ({ onNavigate, user, onLogout, updateUserNickname }) => {
  // 评价数据
  const testimonials = [
    {
      id: 1,
      text: "起初只是想找個地方寫寫東西，沒想到每一次的回顧，都讓我看見自己驚人的成長。那些三個月前還在煩惱的事，現在看來都雲淡風輕了。這就像是送給未來自己的一份禮物。",
      author: "曉芬，一位使用半年的上班族"
    },
    {
      id: 2,
      text: "身為一個媽媽，我常常忙到忘了照顧自己的內心。這個平台讓我重新找回與自己對話的時間，每一次的記錄都像是一次心靈的洗滌。",
      author: "雅婷，全職媽媽"
    },
    {
      id: 3,
      text: "剛開始使用時還有些懷疑，但隨著時間推移，我發現自己變得更加了解自己。那些重複出現的情緒和想法，都透過這個過程得到了梳理。",
      author: "志明，研究生"
    },
    {
      id: 4,
      text: "這不只是記錄，更像是一面鏡子，讓我真實地看見自己的成長軌跡。當我回顧過去的記錄時，總能感受到滿滿的感動和力量。",
      author: "美玲，設計師"
    },
    {
      id: 5,
      text: "在忙碌的生活中，這個平台成了我與自己對話的專屬空間。每一次的記錄都讓我更清楚地認識自己，也更有勇氣面對未來的挑戰。",
      author: "建華，工程師"
    },
    {
      id: 6,
      text: "作為一個容易焦慮的人，這個工具幫助我學會了如何與自己的情緒相處。透過定期的記錄和回顧，我發現自己變得更加平靜和自信。",
      author: "小雯，護理師"
    },
    {
      id: 7,
      text: "小孩愛ㄘ已購買。",
      author: "阿斯，路人"
    },
    {
      id: 8,
      text: "尻。",
      author: "伩AKA湖口大屌哥"
    },
    {
      id: 9,
      text: "noʎ ʇɹnɥ puɐ ǝı̣ן ɐ ןןǝʇ ɐuuoƃ ɹǝʌǝN\nǝʎqpooƃ ʎɐs ɐuuoƃ ɹǝʌǝu ʎɹɔ noʎ ǝʞɐɯ ɐuuoƃ ɹǝʌǝN\nnoʎ ʇɹǝsǝp puɐ punoɹɐ unɐ ɐuuoƃ ɹǝʌǝN\nuʍop noʎ ʇǝן ɐuuoƃ ɹǝʌǝu dn noʎ ǝʌı̣ƃ ɐuuoƃ ɹǝʌǝN",
      author: "ʎǝןʇsⱯ ʞɔı̣ꓤ"
    },
    {
      id: 10,
      text: "永遠不會給你上\n永遠不會給你下\n永遠不會讓你跑來跑去拋棄你",
      author: "瑞克·艾斯里"
    },
    {
      id: 11,
      text: "朋友也許會背叛你，但數學不會，數學不會就是不會",
      author: "摩根·費里曼·梅友獎鍋"
    },
    {}
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const dropdownRef = useRef(null);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success', position: 'top', variant: 'solid' });

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type, position: 'top', variant: 'solid' });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 2400);
  };

  const showToastCenter = (message, type = 'success') => {
    setToast({ visible: true, message, type, position: 'center', variant: 'glass' });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 2600);
  };

  // 每8秒轮动一次
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex + 2 >= testimonials.length ? 0 : prevIndex + 2
      );
    }, 8000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 處理暱稱修改
  const handleNicknameChange = () => {
    setNewNickname(user.nickname || user.name || user.given_name || '');
    setIsNicknameModalOpen(true);
    setIsDropdownOpen(false);
  };

  const handleSaveNickname = async () => {
    if (!newNickname.trim()) {
      showToastCenter('請輸入暱稱', 'error');
      return;
    }

    if (newNickname.trim().length > 20) {
      showToastCenter('暱稱不能超過20個字元', 'error');
      return;
    }

    try {
      // 呼叫暱稱修改 API
      console.log('發送暱稱修改請求:', {
        email: user.email,
        nickname: newNickname.trim(),
        endpoint: '/user/change'
      });
      
      const response = await updateNickname({
        email: user.email,
        nickname: newNickname.trim()
      });

      console.log('暱稱修改回應:', response);

      // 檢查後端回傳的狀態碼
      const statusCode = response?.statusCode || response?.data?.statusCode || response?.code;
      
      // 只有狀態碼 "0000" 才表示成功
      if (statusCode !== '0000') {
        let errorMsg = '暱稱修改失敗';
        switch (statusCode) {
          case '1004':
            errorMsg = '暱稱已被使用';
            break;
          case '1005':
            errorMsg = '暱稱格式不正確';
            break;
          default:
            errorMsg = '暱稱修改失敗，請稍後再試';
        }
        showToastCenter(errorMsg, 'error');
        return;
      }

      // API 成功後更新本地狀態
      updateUserNickname(newNickname.trim());
      showToastCenter('暱稱修改成功', 'success');
      setIsNicknameModalOpen(false);
      setNewNickname('');
    } catch (error) {
      console.error('暱稱修改失敗詳細錯誤:', error);
      console.error('錯誤狀態碼:', error?.status);
      console.error('錯誤資料:', error?.data);
      console.error('完整錯誤物件:', JSON.stringify(error, null, 2));
      
      // 特別處理 404 錯誤
      if (error?.status === 404) {
        showToastCenter('所有暱稱修改 API 端點都不存在 (404)。\n請檢查後端是否已實作相關功能。', 'error');
        return;
      }
      
      // 處理 HTTP 錯誤或其他異常
      const statusCode = error?.data?.statusCode || error?.data?.code;
      if (statusCode) {
        let errorMsg = '暱稱修改失敗';
        switch (statusCode) {
          case '1004':
            errorMsg = '暱稱已被使用';
            break;
          case '1005':
            errorMsg = '暱稱格式不正確';
            break;
          default:
            errorMsg = '暱稱修改失敗，請稍後再試';
        }
        showToastCenter(errorMsg, 'error');
      } else {
        const msg = error?.data?.message || error?.message || error?.toString() || '暱稱修改失敗，請稍後再試';
        showToastCenter(`暱稱修改失敗: ${msg}`, 'error');
      }
    }
  };

  const handleCancelNickname = () => {
    setIsNicknameModalOpen(false);
    setNewNickname('');
  };

  // 判斷是否為 Google 登入用戶
  const isGoogleUser = user ? (user.googleId || user.sub) : false;

  // 處理密碼修改
  const handlePasswordChange = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsPasswordModalOpen(true);
    setIsDropdownOpen(false);
  };

  const handleSavePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showToastCenter('請填寫所有欄位', 'error');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToastCenter('新密碼與確認密碼不匹配', 'error');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      showToastCenter('新密碼至少需要8個字元', 'error');
      return;
    }
    
    try {
      // 呼叫密碼修改 API
      const response = await changePassword({
        email: user.email,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      // 檢查後端回傳的狀態碼
      const statusCode = response?.statusCode || response?.data?.statusCode || response?.code;
      
      // 只有狀態碼 "0000" 才表示成功
      if (statusCode !== '0000') {
        let errorMsg = '密碼修改失敗';
        switch (statusCode) {
          case '1002':
            errorMsg = '目前密碼錯誤';
            break;
          case '1003':
            errorMsg = '新密碼格式不正確';
            break;
          default:
            errorMsg = '密碼修改失敗，請稍後再試';
        }
        showToastCenter(errorMsg, 'error');
        return;
      }

      showToastCenter('密碼修改成功', 'success');
      setIsPasswordModalOpen(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('密碼修改失敗:', error);
      
      // 處理 HTTP 錯誤或其他異常
      const statusCode = error?.data?.statusCode || error?.data?.code;
      if (statusCode) {
        let errorMsg = '密碼修改失敗';
        switch (statusCode) {
          case '1002':
            errorMsg = '目前密碼錯誤';
            break;
          case '1003':
            errorMsg = '新密碼格式不正確';
            break;
          default:
            errorMsg = '密碼修改失敗，請稍後再試';
        }
        showToastCenter(errorMsg, 'error');
      } else {
        const msg = error?.data?.message || error?.message || '密碼修改失敗，請稍後再試';
        showToastCenter(msg, 'error');
      }
    }
  };

  const handleCancelPassword = () => {
    setIsPasswordModalOpen(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  // 获取当前显示的两个评价
  const getCurrentTestimonials = () => {
    const firstIndex = currentIndex;
    const secondIndex = (currentIndex + 1) % testimonials.length;
    return [testimonials[firstIndex], testimonials[secondIndex]];
  };

  return (
    <div className="w-full bg-[#FDFCF9] text-[#3D4A4D]">
      {toast.visible && (
        toast.position === 'center' ? (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={() => setToast(prev => ({ ...prev, visible: false }))} />
            <div className={`relative mx-6 w-full max-w-sm rounded-2xl shadow-2xl transition-all duration-300 ${toast.variant === 'glass' ? 'bg-white/80 backdrop-blur-md border border-white/60' : 'bg-white border border-gray-200'} p-5`}>
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                  <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-gray-800">{toast.type === 'success' ? '成功' : '錯誤'}</p>
                  <p className="text-sm text-gray-700 mt-1">{toast.message}</p>
                </div>
                <button
                  onClick={() => setToast(prev => ({ ...prev, visible: false }))}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close toast"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="fixed top-6 inset-x-0 z-[100] flex justify-center px-4">
            <div className={`flex items-start gap-3 rounded-lg shadow-lg border px-4 py-3 w-full max-w-md transition-all duration-300 ${toast.type === 'success' ? 'bg-white border-green-200' : 'bg-white border-red-200'}`}>
              <div className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{toast.type === 'success' ? '成功' : '錯誤'}</p>
                <p className="text-sm text-gray-600 mt-0.5">{toast.message}</p>
              </div>
              <button
                onClick={() => setToast(prev => ({ ...prev, visible: false }))}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close toast"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )
      )}
      {/* Header */}
      <header className="py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b border-gray-200/50">
        <a href="#" onClick={e => { e.preventDefault(); onNavigate('home'); }}><Logo /></a>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center gap-3">
                <span className="text-[#8A9A87] font-semibold">
                  歡迎，{user.nickname || user.name || user.given_name || user.email}
                </span>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="px-3 py-1.5 rounded-full bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300 transition-colors flex items-center gap-1"
                >
                  選單
                  <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              
              {/* 下拉選單 */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                  <button
                    onClick={handleNicknameChange}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    暱稱修改
                  </button>
                  {/* 只對非 Google 用戶顯示密碼修改選項 */}
                  {!isGoogleUser && (
                    <button
                      onClick={handlePasswordChange}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      密碼修改
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onNavigate('review');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    回顧快照
                  </button>
                  <hr className="my-1 border-gray-200" />
                  <button
                    onClick={() => {
                      onLogout();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    登出
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => onNavigate('login')} className="px-4 py-2 rounded-full bg-[#8A9A87] text-white text-sm font-semibold hover:bg-[#7A8A77] transition-colors">
              登入/註冊
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="bg-[#F3F0E9] relative overflow-hidden">
        {/* 背景圖與漸層遮罩 */}
        <div className="absolute inset-0 w-full h-full z-0">
          <video src="/素材/top_15.mp4" autoPlay muted loop className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 w-full h-full pointer-events-none" style={{background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.8) 100%)'}}></div>
        </div>
        <div className="container mx-auto px-6 py-20 md:py-32 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold section-title leading-tight">
            嘿，有多久沒有好好跟自己說話了？
          </h1>
          <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-gray-600">
            在人生的時間軸上，為此刻的自己，留下一張溫柔的快照。
            <br className="hidden md:block" />
            這是一個專屬於你的私密空間，用來傾聽、整理，並看見自己的成長。
          </p>
          <button onClick={() => {
            const targetSection = document.querySelector('.soft-bg');
            if (targetSection) {
              targetSection.scrollIntoView({ behavior: 'smooth' });
            }
          }} className="btn-primary mt-10">
            我想和自己聊聊
          </button>
        </div>
      </main>

      {/* WHO is this for? */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center section-title">你是否也正經歷這些時刻？</h2>
          <p className="text-center mt-4 text-gray-600 max-w-2xl mx-auto">如果答案為「是」，「人生快照」也許能成為你溫柔的後盾。</p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 rounded-lg text-center">
              <div className="text-5xl mb-4">🌪️</div>
              <h3 className="text-xl font-semibold mb-2">在迷霧中打轉</h3>
              <p className="text-gray-600">被外界的聲音與期待淹沒，漸漸聽不見自己內心的聲音。</p>
            </div>
            <div className="card p-8 rounded-lg text-center">
              <div className="text-5xl mb-4">🏃‍♀️</div>
              <h3 className="text-xl font-semibold mb-2">在忙碌中盲目</h3>
              <p className="text-gray-600">日子一天天過，卻感覺像在原地踏步，忘了最初想去的地方。</p>
            </div>
            <div className="card p-8 rounded-lg text-center">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold mb-2">渴望真實成長</h3>
              <p className="text-gray-600">想要一個地方能安放思緒，記錄點滴，真實地看見自己的蛻變。</p>
            </div>
          </div>
        </div>
      </section>

      {/* YouTube Playlist Section */}
      <HomePageVideo />

      {/* HOW it works? */}
      <section className="py-16 md:py-24 soft-bg">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center section-title">只需 15 分鐘，開啟一場深度的自我對話</h2>
          <p className="text-center mt-4 text-gray-600 max-w-2xl mx-auto">泡一杯茶，找個舒服的角落。過程簡單直觀，你的所有紀錄都將被安全珍藏。</p>
          <div className="mt-12 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 items-start">
            <div className="text-center p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white rounded-full shadow-md mb-4 border border-gray-100">
                <span className="text-3xl font-bold text-[#8A9A87]">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">真誠回答</h3>
              <p className="text-gray-600">透過精心設計的提問，溫柔地探問你的內心，關於生活、情緒與渴望。</p>
            </div>
            <div className="text-center p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white rounded-full shadow-md mb-4 border border-gray-100">
                <span className="text-3xl font-bold text-[#8A9A87]">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">此刻印記</h3>
              <p className="text-gray-600">上傳一張最能代表當下的照片，為這段記憶留下獨特的視覺標記。</p>
            </div>
            <div className="text-center p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white rounded-full shadow-md mb-4 border border-gray-100">
                <span className="text-3xl font-bold text-[#8A9A87]">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">預約未來</h3>
              <p className="text-gray-600">設定下次快照時間，我們將寄送一封時空信，邀請你回來看看自己走了多遠。</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <button onClick={() => {
              if (user) {
                onNavigate('transition');
              } else {
                onNavigate('login');
              }
            }} className="btn-primary">
              開始我的快照
            </button>
            <p className="mt-4 text-sm text-gray-500">免費註冊，永久保存你的成長軌跡</p>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center section-title">聽聽他們怎麼說</h2>
          <div className="mt-12 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {getCurrentTestimonials().map((testimonial, index) => (
                <div key={testimonial.id} className="testimonial-card p-8 rounded-lg transition-all duration-500 ease-in-out">
                  <p className="text-lg text-gray-700 italic whitespace-pre-line">"{testimonial.text}"</p>
                  <p className="mt-6 font-semibold text-right text-gray-600">— {testimonial.author}</p>
                </div>
              ))}
            </div>
            {/* 指示器 */}
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: Math.ceil(testimonials.length / 2) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i * 2)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentIndex === i * 2 ? 'bg-[#8A9A87]' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHEN & WHERE to use (Benefits) */}
      <section className="py-16 md:py-24 soft-bg">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <video src="/素材/chill_corner.mp4" autoPlay muted loop className="rounded-lg shadow-lg w-full" />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold section-title">一個讓你安心的角落</h2>
            <p className="mt-4 text-lg text-gray-600">我們承諾，這裡的一切都專屬於你。你的思緒將被妥善安放，不被打擾。</p>
            <ul className="mt-6 space-y-4 text-gray-700">
              <li className="flex items-center gap-4">
                <CssIconCheck />
                <span><strong>絕對私密：</strong> 你的所有紀錄都經過加密，除了你，沒有人能看見。</span>
              </li>
              <li className="flex items-center gap-4">
                <CssIconCheck />
                <span><strong>隨時陪伴：</strong> 手機、平板、電腦，無縫接軌你的思緒，隨時隨地都能回來看看。</span>
              </li>
              <li className="flex items-center gap-4">
                <CssIconCheck />
                <span><strong>溫柔提醒：</strong> 我們是你與未來的信使，在你設定的時間，溫柔地提醒你回來看看自己。</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200/80">
        <div className="container mx-auto px-6 py-8 text-center text-gray-500">
          <p>&copy; 2025 人生快照 (Check Point). All Rights Reserved.</p>
          <div className="mt-4 flex justify-center space-x-6">
            <a href="#" className="hover:text-[#8A9A87] transition-colors">隱私權政策</a>
            <a href="#" className="hover:text-[#8A9A87] transition-colors">服務條款</a>
            <a href="#" className="hover:text-[#8A9A87] transition-colors">聯絡我們</a>
          </div>
        </div>
      </footer>

      {/* 暱稱修改彈出視窗 */}
      {isNicknameModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">修改暱稱</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                新暱稱
              </label>
              <input
                type="text"
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A9A87] focus:border-transparent"
                placeholder="請輸入新的暱稱"
                maxLength={20}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelNickname}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSaveNickname}
                disabled={!newNickname.trim()}
                className="px-4 py-2 bg-[#8A9A87] text-white rounded-md hover:bg-[#7A8A77] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                儲存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 密碼修改彈出視窗 */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">修改密碼</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  目前密碼
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A9A87] focus:border-transparent"
                  placeholder="請輸入目前密碼"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  新密碼
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A9A87] focus:border-transparent"
                  placeholder="請輸入新密碼（至少8個字元）"
                  minLength={8}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  確認新密碼
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A9A87] focus:border-transparent"
                  placeholder="請再次輸入新密碼"
                  minLength={8}
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={handleCancelPassword}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSavePassword}
                disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                className="px-4 py-2 bg-[#8A9A87] text-white rounded-md hover:bg-[#7A8A77] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                儲存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage; 