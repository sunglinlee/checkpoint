import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const Logo = () => (
  <div className="flex items-center gap-2">
    <img src="/logo/LOGO.png" alt="Check Point Logo" className="h-10 w-auto" />
    <img src="/logo/LOGO_H1.png" alt="Company Name" className="h-8 w-auto" />
  </div>
);


// 忘記密碼模態框組件
const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      alert('請輸入您的電子郵件地址');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // 這裡可以添加實際的重置密碼邏輯
      console.log('發送重置密碼郵件到:', email);
      alert('重置密碼郵件已發送到您的信箱，請查收');
      setEmail('');
      onClose();
    } catch (error) {
      console.error('發送重置密碼郵件失敗:', error);
      alert('發送失敗，請稍後再試');
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

const LoginPage = ({ onNavigate }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert('密碼確認不匹配');
      return;
    }
    // 這裡可以添加實際的登入/註冊邏輯
    console.log(`${isLogin ? '登入' : '註冊'}`, formData);
  };

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log('Google登入成功:', decoded);
      // 這裡可以添加實際的Google登入處理邏輯
      onNavigate('home'); // 登入成功後導航到首頁
    } catch (error) {
      console.error('Google登入失敗:', error);
    }
  };

  const handleGoogleError = () => {
    console.error('Google登入失敗');
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] flex flex-col">
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
                className="w-full bg-[#8A9A87] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#7A8A77] transition-colors focus:ring-2 focus:ring-[#8A9A87] focus:ring-offset-2"
              >
                {isLogin ? '登入' : '註冊'}
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

      {/* 忘記密碼模態框 */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
};

export default LoginPage; 