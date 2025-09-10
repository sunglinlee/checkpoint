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

// 個別快照倒數計時組件
const SnapshotCountdown = ({ targetDate, onUnlock, snapshotId }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setIsUnlocked(true);
        onUnlock(snapshotId);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [targetDate, onUnlock, snapshotId]);

  if (isUnlocked) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white p-3 rounded-b-lg">
      <div className="container mx-auto flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span>解鎖倒數：</span>
          <div className="flex gap-2">
            <div className="bg-white/20 rounded px-2 py-1 min-w-[40px] text-center">
              <div className="font-bold">{timeLeft.days}</div>
              <div className="text-xs">天</div>
            </div>
            <div className="bg-white/20 rounded px-2 py-1 min-w-[40px] text-center">
              <div className="font-bold">{timeLeft.hours}</div>
              <div className="text-xs">時</div>
            </div>
            <div className="bg-white/20 rounded px-2 py-1 min-w-[40px] text-center">
              <div className="font-bold">{timeLeft.minutes}</div>
              <div className="text-xs">分</div>
            </div>
            <div className="bg-white/20 rounded px-2 py-1 min-w-[40px] text-center">
              <div className="font-bold">{timeLeft.seconds}</div>
              <div className="text-xs">秒</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewPage = ({ onNavigate, user }) => {
  const [snapshots, setSnapshots] = useState([]);
  const [selectedSnapshot, setSelectedSnapshot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [unlockedSnapshots, setUnlockedSnapshots] = useState(new Set());

  const showToastCenter = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 2600);
  };

  // 檢查快照是否被鎖定
  // 基於後端提供的 reminder_date (SCHEDULE_TIME) 判斷是否鎖定
  const isSnapshotLocked = (snapshot) => {
    if (!snapshot.reminder_date) return false; // 沒有 reminder_date 表示已解鎖
    if (unlockedSnapshots.has(snapshot.id)) return false; // 用戶手動解鎖
    
    const now = new Date().getTime();
    const scheduleTime = new Date(snapshot.reminder_date).getTime();
    return now < scheduleTime; // 當前時間小於預定解鎖時間則鎖定
  };

  // 解鎖快照
  const unlockSnapshot = (snapshotId) => {
    setUnlockedSnapshots(prev => new Set([...prev, snapshotId]));
    showToastCenter('快照已解鎖！', 'success');
  };

  // 獲取最早的鎖定時間（用於顯示倒數計時）
  // 基於後端提供的 reminder_date 找出最早需要解鎖的時間
  const getEarliestLockTime = () => {
    const lockedSnapshots = snapshots.filter(s => isSnapshotLocked(s));
    if (lockedSnapshots.length === 0) return null;
    
    return lockedSnapshots.reduce((earliest, snapshot) => {
      const snapshotTime = new Date(snapshot.reminder_date).getTime();
      return snapshotTime < earliest ? snapshotTime : earliest;
    }, new Date(lockedSnapshots[0].reminder_date).getTime());
  };


  // 從 localStorage 獲取已分配的圖片
  const getStoredImageAssignments = () => {
    try {
      const stored = localStorage.getItem('snapshotImageAssignments');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  };

  // 儲存圖片分配到 localStorage
  const saveImageAssignment = (snapshotId, imagePath) => {
    try {
      const stored = getStoredImageAssignments();
      stored[snapshotId] = imagePath;
      localStorage.setItem('snapshotImageAssignments', JSON.stringify(stored));
    } catch (error) {
      console.warn('無法儲存圖片分配:', error);
    }
  };

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
        
        // 獲取已儲存的圖片分配
        const storedAssignments = getStoredImageAssignments();
        
        // 若後端未提供 assigned_image 或 image_url，檢查 localStorage 或重新分配
        const usedImagesRef = {};
        const withAssigned = list.map((s) => {
          let snapshot = { ...s };
          
          if (!snapshot?.image_url && !snapshot?.assigned_image) {
            // 先檢查是否已有儲存的分配
            if (storedAssignments[snapshot.id]) {
              snapshot.assigned_image = storedAssignments[snapshot.id];
            } else {
              // 如果沒有儲存的分配，才進行新的隨機分配
              const assigned = assignImageByMood(snapshot?.mood, usedImagesRef);
              snapshot.assigned_image = assigned;
              // 儲存新的分配
              saveImageAssignment(snapshot.id, assigned);
            }
          }
          
          // reminder_date 完全依賴後端提供
          // 如果後端沒有提供 reminder_date，表示該快照已解鎖
          
          return snapshot;
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
      showToastCenter('快照名稱不能為空', 'error');
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
      showToastCenter('標題已更新', 'success');
    } catch (error) {
      console.error('更新快照標題失敗:', error);
      showToastCenter('更新失敗，請稍後再試', 'error');
    }
  };

  const handleCancelEdit = () => {
    setIsEditingTitle(false);
    setEditingTitle('');
  };

  const handleDeleteSnapshot = () => {
    if (!selectedSnapshot?.id) return;
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedSnapshot?.id) return;
    try {
      setIsDeleting(true);
      await apiDeleteSnapshot(selectedSnapshot.id);
      setSnapshots(prev => prev.filter(s => s.id !== selectedSnapshot.id));
      setSelectedSnapshot(null);
      setIsEditingTitle(false);
      setEditingTitle('');
      showToastCenter('已刪除快照', 'success');
    } catch (error) {
      console.error('刪除快照失敗:', error);
      showToastCenter('刪除失敗，請稍後再試', 'error');
    } finally {
      setIsDeleting(false);
      setConfirmDeleteOpen(false);
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

  const earliestLockTime = getEarliestLockTime();

  return (
    <div className="w-full min-h-screen bg-[#FDFCF9] text-[#3D4A4D]">
      {toast.visible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={() => setToast(prev => ({ ...prev, visible: false }))} />
          <div className={`relative mx-6 w-full max-w-sm rounded-2xl shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-md border border-white/60 p-5`}>
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
      )}

      {confirmDeleteOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={() => setConfirmDeleteOpen(false)} />
          <div className="relative mx-6 w-full max-w-sm rounded-2xl shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-md border border-white/60 p-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-red-500">
                <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-gray-800">確認刪除</p>
                <p className="text-sm text-gray-700 mt-1">確定要刪除此快照嗎？此動作無法復原。</p>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => setConfirmDeleteOpen(false)}
                    className="px-3 py-1.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                  >
                    取消
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className={`px-3 py-1.5 rounded-full text-white text-sm transition-colors ${isDeleting ? 'bg-red-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
                  >
                    {isDeleting ? '刪除中...' : '刪除'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
            {snapshots.map((snapshot) => {
              const isLocked = isSnapshotLocked(snapshot);
              return (
                <div 
                  key={snapshot.id}
                  className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 relative ${
                    isLocked 
                      ? 'opacity-60 cursor-not-allowed' 
                      : 'hover:shadow-lg cursor-pointer'
                  }`}
                  onClick={() => !isLocked && setSelectedSnapshot(snapshot)}
                >
                  {/* 鎖定覆蓋層 */}
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/20 z-10 flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg">
                        <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                  
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    <img 
                      src={getSnapshotDisplayImage(snapshot)} 
                      alt={snapshot.title}
                      className={`w-full h-full object-cover transition-all duration-300 ${
                        isLocked ? 'filter blur-sm grayscale' : ''
                      }`}
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMoodColor(snapshot.mood)}`}>
                        {snapshot.mood}
                      </span>
                    </div>
                    {isLocked && (
                      <div className="absolute top-3 left-3">
                        <div className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          鎖定中
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-gray-500 mb-2">{formatDate(snapshot.date)}</div>
                    <h3 className={`font-semibold text-lg mb-2 ${isLocked ? 'text-gray-400' : ''}`}>
                      {snapshot.title}
                    </h3>
                    <p className={`text-sm line-clamp-2 mb-3 ${isLocked ? 'text-gray-400' : 'text-gray-600'}`}>
                      {isLocked ? '內容已鎖定，等待解鎖時間到達...' : snapshot.content}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {snapshot.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className={`px-2 py-1 text-xs rounded-full ${
                            isLocked 
                              ? 'bg-gray-200 text-gray-400' 
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* 個別快照倒數計時 */}
                  {isLocked && snapshot.reminder_date && (
                    <SnapshotCountdown 
                      targetDate={snapshot.reminder_date}
                      onUnlock={unlockSnapshot}
                      snapshotId={snapshot.id}
                    />
                  )}
                </div>
              );
            })}
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