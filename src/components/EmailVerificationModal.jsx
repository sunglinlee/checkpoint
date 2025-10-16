import React from 'react';

const EmailVerificationModal = ({ isOpen, onClose, userEmail }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
        {/* 關閉按鈕 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 圖標 */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* 標題 */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-[#3D4A4D] mb-2">註冊成功！</h2>
          <p className="text-gray-600">
            驗證郵件已發送至您的信箱
          </p>
        </div>

        {/* 郵件地址顯示 */}
        {userEmail && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-600 text-center">
              郵件已發送至：
            </p>
            <p className="text-sm font-medium text-[#3D4A4D] text-center break-all">
              {userEmail}
            </p>
          </div>
        )}

        {/* 說明文字 */}
        <div className="mb-6">
          <p className="text-gray-600 text-sm leading-relaxed">
            請檢查您的信箱（包括垃圾郵件資料夾），點擊驗證連結完成帳戶啟用。驗證完成後即可開始使用所有功能。
          </p>
        </div>

        {/* 提示框 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm text-blue-800 font-medium mb-1">小提醒</p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• 驗證郵件可能需要幾分鐘才會送達</li>
                <li>• 請檢查垃圾郵件資料夾</li>
                <li>• 驗證連結將在 10 分鐘後失效</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 按鈕 */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            稍後驗證
          </button>
          <button
            onClick={() => {
              window.open('https://mail.google.com', '_blank');
            }}
            className="flex-1 bg-[#8A9A87] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#7A8A77] transition-colors"
          >
            打開信箱
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal;