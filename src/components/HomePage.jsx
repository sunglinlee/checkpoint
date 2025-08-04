import React from 'react';

const HomePage = ({ onNavigate }) => {
    const CssIconCheck = () => (
        <div className="inline-block w-6 h-6 bg-[#8A9A87] rounded-full relative flex-shrink-0">
            <span className="absolute left-[0.5rem] top-[0.25rem] w-2 h-3.5 border-solid border-white border-r-[3px] border-b-[3px] transform rotate-45"></span>
        </div>
    );

    const Logo = () => (
        <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#5C6B68] relative flex items-center justify-center overflow-hidden">
                <div className="absolute top-2 w-3 h-3 bg-[#FDFCF9] rounded-full"></div>
                <div className="absolute -bottom-1 w-6 h-6 bg-[#FDFCF9] rounded-t-full"></div>
                <div className="w-0.5 h-3 bg-[#FDFCF9] absolute right-[0.6rem] bottom-2 transform rotate-[75deg] origin-bottom"></div>
            </div>
            <span className="text-xl font-bold text-[#5C6B68]">人生快照</span>
        </div>
    );

    return (
        <div className="w-full bg-[#FDFCF9] text-[#3D4A4D]">
            <header className="py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b border-gray-200/50">
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}><Logo /></a>
                <button onClick={() => onNavigate('transition')} className="hidden md:inline-block px-6 py-2 rounded-full bg-[#8A9A87] text-white hover:bg-[#738370] transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 shadow-sm hover:shadow-md text-sm font-semibold">
                    開始我的第一次快照
                </button>
            </header>

            <main className="bg-[#F3F0E9]">
                <div className="container mx-auto px-6 py-20 md:py-32 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#5C6B68] leading-tight">嘿，有多久沒有好好跟自己說話了？</h1>
                    <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-gray-600">
                        在人生的時間軸上，為此刻的自己，留下一張溫柔的快照。
                        <br className="hidden md:block" />
                        這是一個專屬於你的私密空間，用來傾聽、整理，並看見自己的成長。
                    </p>
                    <button onClick={() => onNavigate('transition')} className="btn-primary mt-10">
                        我想和自己聊聊
                    </button>
                </div>
            </main>

            <section className="py-16 md:py-24">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-[#5C6B68]">你是否也正經歷這些時刻？</h2>
                    <p className="text-center mt-4 text-gray-600 max-w-2xl mx-auto">如果答案為「是」，「人生快照」也許能成為你溫柔的後盾。</p>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Cards */}
                        <div className="bg-white border border-gray-200/50 shadow-sm hover:shadow-lg transition-shadow duration-300 p-8 rounded-lg text-center">
                            <div className="text-5xl mb-4">🌪️</div>
                            <h3 className="text-xl font-semibold mb-2">在迷霧中打轉</h3>
                            <p className="text-gray-600">被外界的聲音與期待淹沒，漸漸聽不見自己內心的聲音。</p>
                        </div>
                        <div className="bg-white border border-gray-200/50 shadow-sm hover:shadow-lg transition-shadow duration-300 p-8 rounded-lg text-center">
                            <div className="text-5xl mb-4">🏃‍♀️</div>
                            <h3 className="text-xl font-semibold mb-2">在忙碌中盲目</h3>
                            <p className="text-gray-600">日子一天天過，卻感覺像在原地踏步，忘了最初想去的地方。</p>
                        </div>
                        <div className="bg-white border border-gray-200/50 shadow-sm hover:shadow-lg transition-shadow duration-300 p-8 rounded-lg text-center">
                            <div className="text-5xl mb-4">🌱</div>
                            <h3 className="text-xl font-semibold mb-2">渴望真實成長</h3>
                            <p className="text-gray-600">想要一個地方能安放思緒，記錄點滴，真實地看見自己的蛻變。</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <footer className="bg-[#F9F7F2] border-t border-gray-200/80">
                <div className="container mx-auto px-6 py-8 text-center text-gray-500">
                    <p>&copy; 2024 人生快照 (Check Point). All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage; 