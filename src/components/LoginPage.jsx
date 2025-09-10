import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { loginUser, registerUser, mailLogin, logoutUser, refreshToken, persistAuth, startTokenRefresh, stopTokenRefresh, forgetPassword } from '../api/auth';

const Logo = () => (
  <div className="flex items-center gap-2">
    <img src="/logo/LOGO.png" alt="Check Point Logo" className="h-10 w-auto" />
    <img src="/logo/LOGO_H1.png" alt="Company Name" className="h-8 w-auto" />
  </div>
);

// 忘記密碼模態框組件
const ForgotPasswordModal = ({ isOpen, onClose, showToast }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('請輸入您的電子郵件地址', 'error');
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log('發送重置密碼郵件到:', email);
      const response = await forgetPassword({ email: email.trim() });
      
      // 檢查後端回傳的狀態碼
      const statusCode = response?.statusCode || response?.data?.statusCode || response?.code;
      
      // 只有狀態碼 "0000" 才表示成功
      if (statusCode !== '0000') {
        let errorMsg = '發送失敗，請稍後再試';
        switch (statusCode) {
          case '1006':
            errorMsg = '此電子郵件地址不存在';
            break;
          case '1007':
            errorMsg = '電子郵件格式不正確';
            break;
          default:
            errorMsg = '發送失敗，請稍後再試';
        }
        showToast(errorMsg, 'error');
        return;
      }

      showToast('重置密碼郵件已發送到您的信箱，請查收', 'success');
      setEmail('');
      onClose();
    } catch (error) {
      console.error('發送重置密碼郵件失敗:', error);
      
      // 處理 HTTP 錯誤或其他異常
      const statusCode = error?.data?.statusCode || error?.data?.code;
      if (statusCode) {
        let errorMsg = '發送失敗，請稍後再試';
        switch (statusCode) {
          case '1006':
            errorMsg = '此電子郵件地址不存在';
            break;
          case '1007':
            errorMsg = '電子郵件格式不正確';
            break;
          default:
            errorMsg = '發送失敗，請稍後再試';
        }
        showToast(errorMsg, 'error');
      } else {
        const msg = error?.data?.message || error?.message || '發送失敗，請稍後再試';
        showToast(msg, 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#3D4A4D]">忘記密碼</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">
          請輸入您註冊時使用的電子郵件地址，我們將發送重置密碼的連結給您。
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-1">
              電子郵件
            </label>
            <input
              type="email"
              id="resetEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A9A87] focus:border-transparent transition-colors"
              placeholder="請輸入您的電子郵件"
            />
          </div>
          
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#8A9A87] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#7A8A77] transition-colors focus:ring-2 focus:ring-[#8A9A87] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '發送中...' : '發送重置郵件'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 已移除暱稱輸入彈窗，Google 直接登入

const LoginPage = ({ onNavigate, setUser, updateUserNickname }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [googleUserData, setGoogleUserData] = useState(null);
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success', position: 'center', variant: 'glass' });

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type, position: 'center', variant: 'glass' });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 2600);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 狀態碼對應的錯誤訊息
  const getStatusCodeMessage = (statusCode) => {
    switch (statusCode) {
      case '1001':
        return '此Email重複註冊';
      case '1002':
        return '密碼錯誤';
      case '1003':
        return '此電子郵件已使用其他認證方式註冊';
      case '1004':
        return '認證方式不匹配';
      default:
        return '操作失敗，請稍後再試';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setErrorMessage('密碼確認不匹配');
      return;
    }
    try {
      setIsSubmitting(true);
      const payload = {
        email: formData.email.trim(),
        password: formData.password
      };
      if (!isLogin) {
        payload.nickname = formData.nickname.trim();
      }

      const response = isLogin
        ? await loginUser(payload)
        : await registerUser(payload);

      // 檢查後端回傳的狀態碼
      const statusCode = response?.statusCode || response?.data?.statusCode || response?.code;
      
      // 只有狀態碼 "0000" 才允許登入成功
      if (statusCode !== '0000') {
        const errorMsg = getStatusCodeMessage(statusCode);
        setErrorMessage(errorMsg);
        return;
      }

      const token = response.token || response.accessToken || response.data?.token;
      const responseUser = response.user || response.data?.user || response.data || {};
      const resolvedEmail = responseUser.email || formData.email;
      const resolvedName = responseUser.name || responseUser.nickname || undefined;
      const user = {
        email: resolvedEmail,
        name: resolvedName,
        nickname: resolvedName,
        avatar: responseUser.avatar
      };

      persistAuth(token, user);
      // 啟動背景 refresh（每 30 分鐘）
      if (user?.email) {
        stopTokenRefresh();
        startTokenRefresh(user.email);
      }
      setUser(user);
      onNavigate('home');
    } catch (error) {
      // 處理 HTTP 錯誤或其他異常
      const statusCode = error?.data?.statusCode || error?.data?.code;
      if (statusCode) {
        const errorMsg = getStatusCodeMessage(statusCode);
        setErrorMessage(errorMsg);
      } else {
        const msg = error?.data?.message || error?.message || '操作失敗，請稍後再試';
        setErrorMessage(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      // decoded 常見欄位: sub(googleId), email, name, picture
      const normalized = {
        googleId: decoded?.sub,
        email: decoded?.email,
        nickname: decoded?.name,
        avatar: decoded?.picture
      };
      setGoogleUserData(normalized);
      // 直接以 Google 資料呼叫 mailLogin
      handleGoogleDirectLogin(normalized);
    } catch (error) {
      console.error('Google登入失敗:', error);
      setErrorMessage('Google 登入解析失敗，請重試');
    }
  };

  const handleGoogleError = () => {
    console.error('Google登入失敗');
  };

  const handleGoogleDirectLogin = async (googleData) => {
    const data = googleData || googleUserData;
    if (!data) return;
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const email = data.email;
      const googleId = data.googleId;
      const avatar = data.avatar;
      // 傳入 Google 的 name 作為後端的 name 欄位
      const response = await mailLogin({ email, googleId, name: data.nickname, avatar });

      // 檢查後端回傳的狀態碼
      const statusCode = response?.statusCode || response?.data?.statusCode || response?.code;
      
      // 只有狀態碼 "0000" 才允許登入成功
      if (statusCode !== '0000') {
        const errorMsg = getStatusCodeMessage(statusCode);
        setErrorMessage(errorMsg);
        return;
      }

      const token = response.token || response.accessToken || response.data?.token;
      const responseUser = response.user || response.data?.user || {};
      const resolvedEmail = responseUser.email || email;
      const backendName = responseUser.name || responseUser.nickname || '';
      const finalName = backendName && String(backendName).trim() ? backendName : data.nickname;
      const finalAvatar = responseUser.avatar || avatar;
      const user = {
        email: resolvedEmail,
        name: finalName,
        nickname: finalName,
        avatar: finalAvatar,
        googleId: googleId  // 添加 googleId 字段用於識別 Google 用戶
      };

      persistAuth(token, user);
      // 啟動背景 refresh（每 30 分鐘）
      if (user?.email) {
        stopTokenRefresh();
        startTokenRefresh(user.email);
      }
      setUser(user);
      onNavigate('home');
    } catch (error) {
      // 處理 HTTP 錯誤或其他異常
      const statusCode = error?.data?.statusCode || error?.data?.code;
      if (statusCode) {
        const errorMsg = getStatusCodeMessage(statusCode);
        setErrorMessage(errorMsg);
      } else {
        const msg = error?.data?.message || error?.message || 'Google 登入失敗，請稍後再試';
        setErrorMessage(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] flex flex-col">
      {/* Toast Notification */}
      {toast.visible && (
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
      )}

      {/* Header */}
      <header className="py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b border-gray-200/50">
        <a href="#" onClick={e => { e.preventDefault(); onNavigate('home'); }}>
          <Logo />
        </a>
        <button 
          onClick={() => onNavigate('home')}
          className="text-[#5C6B68] hover:text-[#8A9A87] transition-colors"
        >
          返回首頁
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-[#3D4A4D] mb-2">
                {isLogin ? '歡迎回來' : '加入我們'}
              </h1>
              <p className="text-gray-600">
                {isLogin ? '登入您的帳戶開始記錄人生快照' : '創建帳戶開始您的人生快照之旅'}
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-md bg-red-50 text-red-600 text-sm">
                {errorMessage}
              </div>
            )}

            {/* Google Login Button */}
            <div className="mb-6">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="outline"
                size="large"
                text={isLogin ? "signin_with" : "signup_with"}
                shape="rectangular"
                locale="zh-TW"
                className="w-full"
              />
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">或</span>
              </div>
            </div>

                         {/* Form */}
             <form onSubmit={handleSubmit} className="space-y-4">
               {!isLogin && (
                 <div>
                   <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
                     暱稱
                   </label>
                   <input
                     type="text"
                     id="nickname"
                     name="nickname"
                     value={formData.nickname}
                     onChange={handleInputChange}
                     required
                     maxLength="20"
                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A9A87] focus:border-transparent transition-colors"
                     placeholder="請輸入您的暱稱"
                   />
                                       {formData.nickname.length === 20 && (
                     <p className="text-xs mt-1 text-red-500">
                       暱稱不能超過20個字
                     </p>
                   )}
                 </div>
               )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  電子郵件
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A9A87] focus:border-transparent transition-colors"
                  placeholder="請輸入您的電子郵件"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  密碼
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength="8"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A9A87] focus:border-transparent transition-colors"
                  placeholder="請輸入至少8位密碼"
                />
                
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    確認密碼
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    minLength="8"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A9A87] focus:border-transparent transition-colors"
                    placeholder="請再次輸入至少8位密碼"
                  />
                  
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#8A9A87] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#7A8A77] transition-colors focus:ring-2 focus:ring-[#8A9A87] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '處理中...' : (isLogin ? '登入' : '註冊')}
              </button>
            </form>

            {/* Toggle Login/Register */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {isLogin ? '還沒有帳戶？' : '已經有帳戶？'}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-1 text-[#8A9A87] hover:text-[#7A8A77] font-semibold transition-colors"
                >
                  {isLogin ? '立即註冊' : '立即登入'}
                </button>
              </p>
            </div>

            {isLogin && (
              <div className="mt-4 text-center">
                <button 
                  onClick={() => setShowForgotPassword(true)}
                  className="text-[#8A9A87] hover:text-[#7A8A77] text-sm transition-colors"
                >
                  忘記密碼？
                </button>
              </div>
            )}
          </div>

          {/* Privacy Notice */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>
              繼續使用即表示您同意我們的{' '}
              <a href="#" className="text-[#8A9A87] hover:underline">服務條款</a>
              {' '}和{' '}
              <a href="#" className="text-[#8A9A87] hover:underline">隱私權政策</a>
            </p>
          </div>
        </div>
      </main>

      {/* 已移除暱稱彈窗 */}

      {/* 忘記密碼模態框 */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        showToast={showToast}
      />
    </div>
  );
};

export default LoginPage; 