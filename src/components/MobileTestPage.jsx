import React, { useState, useRef } from 'react';

const MobileTestPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [testUser, setTestUser] = useState(null);
  const [logoSize, setLogoSize] = useState(10); // Logo 大小狀態
  const [companyLogoSize, setCompanyLogoSize] = useState(8); // 副 Logo 大小狀態
  const dropdownRef = useRef(null);

  const handleFakeLogin = () => {
    const fakeUser = {
      name: '測試用戶名稱非常長的情況下會如何顯示',
      email: 'test@example.com'
    };
    setTestUser(fakeUser);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setTestUser(null);
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
  };

  const Logo = () => {
    // 可調整大小的 Logo
    return (
      <div className="flex items-center gap-2">
        <img 
          src="https://storage.googleapis.com/checkpoint_frontend/logo/LOGO.png" 
          alt="Check Point Logo" 
          style={{ height: `${logoSize * 4}px` }}
          className="w-auto"
        />
        <img 
          src="https://storage.googleapis.com/checkpoint_frontend/logo/LOGO_H1.png" 
          alt="Company Name" 
          style={{ height: `${companyLogoSize * 4}px` }}
          className="w-auto"
        />
        {/* 調試信息 */}
        <div className="text-xs text-gray-500 ml-2 bg-blue-100 px-2 py-1 rounded">
          主:{logoSize*4}px 副:{companyLogoSize*4}px
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-[#FDFCF9] text-[#3D4A4D] min-h-screen">
      {/* Test Header */}
      <header className="py-2 md:py-4 px-4 md:px-12 flex flex-col sm:flex-row justify-between items-start sm:items-center sticky top-0 bg-white/80 backdrop-blur-sm z-[9999] border-b border-gray-200/50 gap-2 sm:gap-4">
        <div className="flex-shrink-0">
          <Logo />
        </div>
        <div className="flex items-center gap-2 md:gap-4 w-full sm:w-auto justify-end">
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center gap-2 md:gap-3">
                <span className="text-[#8A9A87] font-semibold text-sm md:text-base truncate max-w-[120px] md:max-w-none">
                  歡迎，{testUser?.name}
                </span>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="px-3 py-1.5 rounded-full bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300 transition-colors flex items-center gap-1 flex-shrink-0"
                >
                  選單
                  <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              
              {/* 下拉選單 */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[10000]">
                  <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    暱稱修改
                  </button>
                  <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    密碼修改
                  </button>
                  <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    回顧快照
                  </button>
                  <hr className="my-1 border-gray-200" />
                  <button
                    onClick={handleLogout}
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
            <button 
              onClick={handleFakeLogin} 
              className="px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-[#8A9A87] text-white text-xs md:text-sm font-semibold hover:bg-[#7A8A77] transition-colors whitespace-nowrap"
            >
              登入/註冊
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="bg-[#F3F0E9] relative w-full flex items-center" style={{ height: '60vh', overflow: 'hidden' }}>
        {/* 背景影片與漸層遮罩 */}
        <div className="absolute top-0 left-0 w-full h-full z-0" style={{ width: '100%', height: '60vh' }}>

        
          <video 
            src="https://storage.googleapis.com/checkpoint_frontend/素材/top_15_2.mp4" 
            autoPlay 
            muted 
            loop 
            playsInline
            controls={false}
            disablePictureInPicture
            className="pointer-events-none"
            style={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              minWidth: '100%',
              minHeight: '100%',
              width: 'auto',
              height: 'auto',
              objectFit: 'cover',
              zIndex: -1
            }}
          />

          

          {/* 原本的影片代碼 - 已註解 
          
          <img 
            src="your-gif-url-here.gif" 
            alt="Background animation"
            className="pointer-events-none"
            style={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              minWidth: '100%',
              minHeight: '100%',
              width: 'auto',
              height: 'auto',
              objectFit: 'cover',
              zIndex: -1
            }}
          />

            */}

          <div className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.8) 100%)'}}></div>
        </div>
        
        <div className="container mx-auto px-6 py-12 md:py-32 text-center relative z-10 w-full">
          <h1 className="text-2xl md:text-5xl font-bold text-[#5C6B68] leading-tight mt-20 md:mt-0">
            嘿，有多久沒有好好跟自己說話了？
          </h1>
          <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-gray-600">
            在人生的時間軸上，為此刻的自己，留下一張溫柔的快照。
            <br className="hidden md:block" />
            這是一個專屬於你的私密空間，用來傾聽、整理，並看見自己的成長。
          </p>
          <button className="px-10 py-4 rounded-full bg-[#8A9A87] text-white hover:bg-[#738370] transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 shadow-md hover:shadow-lg font-bold text-lg mt-10">
            我想和自己聊聊
          </button>
        </div>
      </main>

      {/* Test Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-[#5C6B68] mb-8">手機測試區域</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* 測試狀態 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">測試狀態</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>登入狀態:</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${isLoggedIn ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {isLoggedIn ? '已登入' : '未登入'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>下拉選單:</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${isDropdownOpen ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {isDropdownOpen ? '已展開' : '已收起'}
                  </span>
                </div>
                {testUser && (
                  <div className="flex items-center justify-between">
                    <span>用戶名稱:</span>
                    <span className="text-sm font-medium">{testUser.name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 測試操作 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">測試操作</h3>
              <div className="space-y-3">
                {!isLoggedIn ? (
                  <button 
                    onClick={handleFakeLogin}
                    className="w-full px-4 py-2 bg-[#8A9A87] text-white rounded-lg hover:bg-[#738370] transition-colors"
                  >
                    模擬登入
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      {isDropdownOpen ? '收起選單' : '展開選單'}
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      登出測試
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Logo 大小調整 */}
            <div className="bg-yellow-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Logo 大小調整</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    主 Logo 大小: {logoSize * 4}px
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="20"
                    value={logoSize}
                    onChange={(e) => setLogoSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    副 Logo 大小: {companyLogoSize * 4}px
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="15"
                    value={companyLogoSize}
                    onChange={(e) => setCompanyLogoSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setLogoSize(10); setCompanyLogoSize(8); }}
                    className="flex-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                  >
                    重置預設
                  </button>
                  <button 
                    onClick={() => { setLogoSize(6); setCompanyLogoSize(5); }}
                    className="flex-1 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                  >
                    小尺寸
                  </button>
                  <button 
                    onClick={() => { setLogoSize(15); setCompanyLogoSize(12); }}
                    className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    大尺寸
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 測試說明 */}
          <div className="mt-12 max-w-2xl mx-auto bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 text-yellow-800">🧪 測試指南</h3>
            <ul className="space-y-2 text-sm text-yellow-700">
              <li>• 點擊「模擬登入」測試登入狀態</li>
              <li>• 檢查 Header 是否不被影片遮擋</li>
              <li>• 測試下拉選單是否顯示在最上層</li>
              <li>• 確認影片是否完全填滿螢幕（無上下空白）</li>
              <li>• 驗證在手機上文字是否正確顯示不重疊</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Video Test Section */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <video 
              src="https://storage.googleapis.com/checkpoint_frontend/素材/chill_corner%20(2).mp4" 
              autoPlay 
              muted 
              loop 
              playsInline
              controls={false}
              disablePictureInPicture
              className="rounded-lg shadow-lg w-full pointer-events-none"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-[#5C6B68]">第二個影片測試</h2>
            <p className="mt-4 text-lg text-gray-600">此影片應該無法操作，只能預覽。</p>
            <div className="mt-6 space-y-2 text-sm text-gray-600">
              <p>✓ 自動播放</p>
              <p>✓ 靜音播放</p>
              <p>✓ 循環播放</p>
              <p>✓ 無控制介面</p>
              <p>✓ 無法點擊操作</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MobileTestPage;