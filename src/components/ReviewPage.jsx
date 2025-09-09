import React, { useState, useEffect } from 'react';
import { getSnapshotDisplayImage, assignImageByMood } from '../utils/imageAssignment';
import { getUserSnapshots, updateSnapshotTitle as apiUpdateSnapshotTitle } from '../api/snapshots';
import { deleteSnapshot as apiDeleteSnapshot } from '../api/snapshots';

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
  const [errorMessage, setErrorMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);


  // 從後端載入用戶快照
  useEffect(() => {
    let mounted = true;
    const loadSnapshots = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const email = user?.email || (typeof window !== 'undefined' ? JSON.parse(window.localStorage.getItem('authUser') || '{}')?.email : undefined);
        const resp = await getUserSnapshots(email);
        const list = resp?.data?.snapshots || [];
        // 若後端未提供 assigned_image 或 image_url，前端依據心情隨機指派一張預設圖片
        const usedImagesRef = {};
        const withAssigned = list.map((s) => {
          if (!s?.image_url && !s?.assigned_image) {
            const assigned = assignImageByMood(s?.mood, usedImagesRef);
            return { ...s, assigned_image: assigned };
          }
          return s;
        });
        if (!mounted) return;
        setSnapshots(withAssigned);
      } catch (err) {
        if (!mounted) return;
        console.error('載入快照失敗:', err);
        setErrorMessage(err?.message || '載入失敗');
        setSnapshots([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    loadSnapshots();
    return () => { mounted = false; };
  }, []);

  const formatDate = (dateString) => {
    // 後端目前回傳格式可能為 "YYYY-MM-DD HH:mm:ss.S"，需轉成可被 Date 正確解析的 ISO 格式
    let normalized = dateString;
    if (typeof dateString === 'string' && /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(dateString)) {
      normalized = dateString.replace(' ', 'T').replace(/\.\d+$/, '') + 'Z';
    }
    const date = new Date(normalized);
    if (isNaN(date.getTime())) {
      return dateString || '';
    }
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
      await apiUpdateSnapshotTitle(selectedSnapshot.id, editingTitle.trim());
      
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

  const handleDeleteSnapshot = async () => {
    if (!selectedSnapshot?.id) return;
    const confirmed = window.confirm('確定要刪除此快照嗎？此動作無法復原。');
    if (!confirmed) return;
    try {
      setIsDeleting(true);
      await apiDeleteSnapshot(selectedSnapshot.id);
      setSnapshots(prev => prev.filter(s => s.id !== selectedSnapshot.id));
      setSelectedSnapshot(null);
      setIsEditingTitle(false);
      setEditingTitle('');
    } catch (error) {
      console.error('刪除快照失敗:', error);
      alert('刪除失敗，請稍後再試');
    } finally {
      setIsDeleting(false);
    }
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
          {errorMessage && (
            <p className="text-center text-red-500 mt-2">{errorMessage}</p>
          )}
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
                    src={getSnapshotDisplayImage(snapshot)} 
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
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
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
                  src={getSnapshotDisplayImage(selectedSnapshot)} 
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
                    onClick={() => {
                      try {
                        if (selectedSnapshot?.id) {
                          window.sessionStorage.setItem('selectedSnapshotId', String(selectedSnapshot.id));
                        }
                      } catch {}
                      onNavigate('checkreview');
                    }}
                    className="inline-block px-4 py-2 text-sm text-[#8A9A87] hover:text-white hover:bg-[#8A9A87] rounded-full transition-all duration-200 border border-[#8A9A87]"
                  >
                    完整快照詳情
                  </button>
                </div>
              </div>
            </div>
            {/* 刪除快照按鈕 */}
            <div className="absolute bottom-4 right-4">
              <button
                onClick={handleDeleteSnapshot}
                disabled={isDeleting}
                title={isDeleting ? '刪除中...' : '刪除此快照'}
                className={`flex items-center justify-center w-10 h-10 rounded-full shadow-md transition-colors ${isDeleting ? 'bg-red-300 text-white cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white'}`}
                aria-label="刪除此快照"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-1-3H10a1 1 0 00-1 1v2h8V5a1 1 0 00-1-1z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewPage;