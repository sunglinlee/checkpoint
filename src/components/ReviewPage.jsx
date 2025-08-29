import React, { useState, useEffect } from 'react';

const Logo = () => (
  <div className="flex items-center gap-2">
    <img src="/logo/LOGO.png" alt="Check Point Logo" className="h-12 w-auto" />
    <img src="/logo/LOGO_H1.png" alt="Company Name" className="h-10 w-auto" />
  </div>
);

const ReviewPage = ({ onNavigate, user }) => {
  const [snapshots, setSnapshots] = useState([]);
  const [selectedSnapshot, setSelectedSnapshot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');

  // 模擬快照數據 - 實際應用中這裡會從後端API獲取
  useEffect(() => {
    // 模擬載入延遲
    setTimeout(() => {
      const mockSnapshots = [
        {
          id: 1,
          date: '2024-12-15',
          title: '年末的反思',
          mood: '平靜',
          image: '/assets/chill_corner.png', // 使用圖片替代影片
          content: '今年過得很快，有很多收穫也有很多挑戰。最重要的是學會了與自己和解。',
          tags: ['成長', '反思', '平靜']
        },
        {
          id: 2,
          date: '2024-11-20',
          title: '轉職的決定',
          mood: '焦慮但充滿希望',
          image: '/素材/焦慮但充滿希望1.jpg',
          content: '決定要轉職了，雖然有些不安，但我相信這是正確的選擇。新的開始總是令人期待的。',
          tags: ['轉職', '決定', '希望']
        },
        {
          id: 3,
          date: '2024-10-08',
          title: '秋天的午後',
          mood: '溫暖',
          image: '/assets/top_15.png',
          content: '今天和朋友喝咖啡聊天，聊到了很多過去的回憶。友情真的是人生中最珍貴的財富之一。',
          tags: ['友情', '回憶', '溫暖']
        },
        {
          id: 4,
          date: '2025-08-18',
          title: '35年後的我',
          mood: '興奮',
          image: '/assets/Rick.png',
          content: '今天和自己喝咖啡聊天，聊到了很多過去的回憶。Never Gonna Give You Up真的是人生中最珍貴的財富之一。',
          tags: ['Rick Roll', '回憶', '瑞克搖']
        }
      ];
      setSnapshots(mockSnapshots);
      setIsLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMoodColor = (mood) => {
    const moodColors = {
      '平靜': 'bg-blue-100 text-blue-800',
      '焦慮但充滿希望': 'bg-yellow-100 text-yellow-800',
      '溫暖': 'bg-orange-100 text-orange-800',
      '開心': 'bg-green-100 text-green-800',
      '沮喪': 'bg-gray-100 text-gray-800',
      '興奮': 'bg-pink-100 text-pink-800'
    };
    return moodColors[mood] || 'bg-gray-100 text-gray-800';
  };

  const handleEditTitle = () => {
    setEditingTitle(selectedSnapshot.title);
    setIsEditingTitle(true);
  };

  const handleSaveTitle = async () => {
    if (editingTitle.trim() === '') {
      alert('快照名稱不能為空');
      return;
    }

    try {
      // 這裡應該呼叫 API 更新快照標題
      // await updateSnapshotTitle(selectedSnapshot.id, editingTitle.trim());
      
      // 更新本地狀態
      const updatedSnapshots = snapshots.map(snapshot => 
        snapshot.id === selectedSnapshot.id 
          ? { ...snapshot, title: editingTitle.trim() }
          : snapshot
      );
      setSnapshots(updatedSnapshots);
      setSelectedSnapshot({ ...selectedSnapshot, title: editingTitle.trim() });
      setIsEditingTitle(false);
      setEditingTitle('');
    } catch (error) {
      console.error('更新快照標題失敗:', error);
      alert('更新失敗，請稍後再試');
    }
  };

  const handleCancelEdit = () => {
    setIsEditingTitle(false);
    setEditingTitle('');
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#FDFCF9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8A9A87] mx-auto mb-4"></div>
          <p className="text-gray-600">載入您的快照中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FDFCF9] text-[#3D4A4D]">
      {/* Header */}
      <header className="py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b border-gray-200/50">
        <a href="#" onClick={e => { e.preventDefault(); onNavigate('home'); }}>
          <Logo />
        </a>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('home')}
            className="px-4 py-2 rounded-full bg-[#8A9A87] text-white text-sm font-semibold hover:bg-[#7A8A77] transition-colors"
          >
            返回首頁
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-4">
            {user?.nickname || user?.name || user?.given_name || '您'}的人生快照回顧
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            這裡收藏著您每一個珍貴的時刻，每一次的成長足跡。讓我們一起回顧這段美好的旅程。
          </p>
        </div>

        {snapshots.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-xl font-semibold mb-2">還沒有快照記錄</h3>
            <p className="text-gray-600 mb-6">開始您的第一個人生快照，記錄此刻的美好</p>
            <button 
              onClick={() => onNavigate('transition')}
              className="px-6 py-3 bg-[#8A9A87] text-white rounded-full font-semibold hover:bg-[#7A8A77] transition-colors"
            >
              開始記錄
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {snapshots.map((snapshot) => (
              <div 
                key={snapshot.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedSnapshot(snapshot)}
              >
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  <img 
                    src={snapshot.image} 
                    alt={snapshot.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMoodColor(snapshot.mood)}`}>
                      {snapshot.mood}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-sm text-gray-500 mb-2">{formatDate(snapshot.date)}</div>
                  <h3 className="font-semibold text-lg mb-2">{snapshot.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">{snapshot.content}</p>
                  <div className="flex flex-wrap gap-1">
                    {snapshot.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 快照詳細檢視彈出視窗 */}
      {selectedSnapshot && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedSnapshot(null)}
        >
          <div 
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3 flex-1">
                {isEditingTitle ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="flex-1 text-xl font-semibold bg-transparent border-b-2 border-[#8A9A87] focus:outline-none focus:border-[#7A8A77] px-1"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveTitle();
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                    />
                    <button
                      onClick={handleSaveTitle}
                      className="p-1 text-green-600 hover:text-green-700 transition-colors"
                      title="儲存"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                      title="取消"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-1">
                    <h3 className="text-xl font-semibold">{selectedSnapshot.title}</h3>
                    <button
                      onClick={handleEditTitle}
                      className="p-1 text-gray-400 hover:text-[#8A9A87] transition-colors"
                      title="編輯快照標題"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              <button 
                onClick={() => {
                  setSelectedSnapshot(null);
                  setIsEditingTitle(false);
                  setEditingTitle('');
                }}
                className="text-gray-500 hover:text-gray-700 ml-4"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <img 
                  src={selectedSnapshot.image} 
                  alt={selectedSnapshot.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div className="mb-4">
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <span>📅 {formatDate(selectedSnapshot.date)}</span>
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getMoodColor(selectedSnapshot.mood)}`}>
                  心情：{selectedSnapshot.mood}
                </span>
              </div>
              <div className="mb-4">
                <h4 className="font-semibold mb-2">當時的想法</h4>
                <p className="text-gray-700 leading-relaxed">{selectedSnapshot.content}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">標籤</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedSnapshot.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-[#8A9A87] text-white text-sm rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="text-center">
                  <button 
                    onClick={() => onNavigate('checkreview')}
                    className="inline-block px-4 py-2 text-sm text-[#8A9A87] hover:text-white hover:bg-[#8A9A87] rounded-full transition-all duration-200 border border-[#8A9A87]"
                  >
                    完整快照詳情
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewPage;