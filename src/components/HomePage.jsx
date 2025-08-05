import React, { useState, useEffect } from 'react';

const CssIconCheck = () => (
  <div className="inline-block w-6 h-6 bg-[#8A9A87] rounded-full relative flex-shrink-0">
    <span className="absolute left-[0.5rem] top-[0.25rem] w-2 h-3.5 border-solid border-white border-r-[3px] border-b-[3px] transform rotate-45"></span>
  </div>
);

const Logo = () => (
  <div className="flex items-center gap-2">
    <img src="/logo/LOGO.png" alt="Check Point Logo" className="h-10 w-auto" />
    <img src="/logo/LOGO_H1.png" alt="Company Name" className="h-8 w-auto" />
  </div>
);


const HomePage = ({ onNavigate, user, onLogout }) => {
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
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // 每8秒轮动一次
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex + 2 >= testimonials.length ? 0 : prevIndex + 2
      );
    }, 8000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  // 获取当前显示的两个评价
  const getCurrentTestimonials = () => {
    const firstIndex = currentIndex;
    const secondIndex = (currentIndex + 1) % testimonials.length;
    return [testimonials[firstIndex], testimonials[secondIndex]];
  };

  return (
    <div className="w-full bg-[#FDFCF9] text-[#3D4A4D]">
      {/* Header */}
      <header className="py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b border-gray-200/50">
        <a href="#" onClick={e => { e.preventDefault(); onNavigate('home'); }}><Logo /></a>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-[#8A9A87] font-semibold">
                歡迎，{user.nickname || user.name || user.given_name || user.email}
              </span>
              <button 
                onClick={onLogout}
                className="px-3 py-1.5 rounded-full bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300 transition-colors"
              >
                登出
              </button>
            </div>
          ) : (
            <button onClick={() => onNavigate('login')} className="px-4 py-2 rounded-full bg-[#8A9A87] text-white text-sm font-semibold hover:bg-[#7A8A77] transition-colors">
              登入/註冊
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="bg-[#F3F0E9]">
        <div className="container mx-auto px-6 py-20 md:py-32 text-center">
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
            <button onClick={() => onNavigate('transition')} className="btn-primary">
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
            <img src="https://placehold.co/600x450/F9F7F2/3D4A4D?text=你的私密心靈角落" alt="一個安靜的角落，桌上放著筆記本與一杯熱茶" className="rounded-lg shadow-lg w-full" />
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
    </div>
  );
};

export default HomePage; 