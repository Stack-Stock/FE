import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';
import { authApi } from '../api/authApi'; // 💡 분리된 API 임포트

const AuthScene = ({ onLoginSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({ nickname: '', email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false); 

  const loginAction = useAuthStore((state) => state.login);
  const publicPath = process.env.PUBLIC_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const switchMode = (mode) => {
    setIsLoginMode(mode);
    setErrorMessage('');
    setFormData({ nickname: '', email: '', password: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      if (isLoginMode) {
        // [1] 로그인 처리 (Axios 활용)
        await authApi.login(formData.email, formData.password);
        
        // 로그인 성공 시 바로 유저 정보 조회
        const userData = await authApi.getMe();
        loginAction(userData);
        onLoginSuccess();
      } else {
        // [2] 회원가입 처리 (Axios 활용)
        await authApi.signup(formData.email, formData.password, formData.nickname);
        
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          switchMode(true);
        }, 1500);
      }
    } catch (error) {
      // 💡 Axios는 상태 코드가 2xx가 아니면 여기로 넘어옵니다. (에러 핸들링이 더 쉬워짐)
      if (error.response) {
        const status = error.response.status;
        if (isLoginMode && status === 401) {
          setErrorMessage('아이디 또는 비밀번호가 올바르지 않습니다.');
        } else if (!isLoginMode && status === 400) {
          setErrorMessage('이미 존재하는 이메일입니다.');
        } else {
          setErrorMessage('서버 요청 중 오류가 발생했습니다.');
        }
      } else {
        setErrorMessage('서버와 통신할 수 없습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      width: '100%', height: '100%', position: 'relative', 
      backgroundImage: `url(${publicPath}/assets/auth/auth_bg.png)`, 
      backgroundSize: 'cover', backgroundPosition: 'center', imageRendering: 'pixelated',
      display: 'flex', justifyContent: 'center', alignItems: 'center' 
    }}>
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ y: -50, opacity: 0 }} animate={{ y: 40, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
            style={{
              position: 'absolute', top: 0, padding: '15px 30px', backgroundColor: '#2ecc71', border: '4px solid #27ae60',
              color: '#fff', fontSize: '18px', fontWeight: 'bold', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.5)', zIndex: 2000
            }}
          >
            회원가입 되었습니다!
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="retro-block"
        style={{ 
          width: '450px', height: '460px', padding: '0', display: 'flex', flexDirection: 'column', 
          backgroundColor: 'rgba(0,0,0,0.85)', boxShadow: '10px 10px 0px rgba(0,0,0,0.5)', border: '4px solid #fff', overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', width: '100%', height: '60px', borderBottom: '4px solid #fff' }}>
          <div onClick={() => switchMode(true)} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px', cursor: 'pointer', backgroundColor: isLoginMode ? '#fff' : 'transparent', color: isLoginMode ? '#000' : '#888', fontWeight: isLoginMode ? 'bold' : 'normal', transition: 'background-color 0.2s, color 0.2s' }}>
            LOGIN
          </div>
          <div style={{ width: '4px', backgroundColor: '#fff' }}></div>
          <div onClick={() => switchMode(false)} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px', cursor: 'pointer', backgroundColor: !isLoginMode ? '#fff' : 'transparent', color: !isLoginMode ? '#000' : '#888', fontWeight: !isLoginMode ? 'bold' : 'normal', transition: 'background-color 0.2s, color 0.2s' }}>
            SIGN UP
          </div>
        </div>

        <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ height: '51px', overflow: 'hidden' }}>
              <AnimatePresence>
                {!isLoginMode && (
                  <motion.input initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} type="text" name="nickname" placeholder="닉네임 (Nickname)" value={formData.nickname} onChange={handleChange} style={{ width: '100%', height: '51px', padding: '12px', fontSize: '16px', border: '3px solid #fff', backgroundColor: '#333', color: '#fff', outline: 'none' }} required />
                )}
              </AnimatePresence>
            </div>
            <input type="email" name="email" placeholder="이메일 (Email)" value={formData.email} onChange={handleChange} style={{ padding: '12px', fontSize: '16px', border: '3px solid #fff', backgroundColor: '#333', color: '#fff', outline: 'none' }} required />
            <input type="password" name="password" placeholder="비밀번호 (Password)" value={formData.password} onChange={handleChange} style={{ padding: '12px', fontSize: '16px', border: '3px solid #fff', backgroundColor: '#333', color: '#fff', outline: 'none' }} required />
          </form>

          <div>
            <div style={{ height: '24px', textAlign: 'center', marginBottom: '10px' }}>
              {errorMessage && <span style={{ color: '#ff4b4b', fontSize: '14px' }}>{errorMessage}</span>}
            </div>
            <button onClick={handleSubmit} className="pixel-btn" disabled={isLoading} style={{ padding: '15px', fontSize: '20px', width: '100%' }}>
              {isLoading ? '통신 중...' : (isLoginMode ? '접속하기' : '가입완료')}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthScene;