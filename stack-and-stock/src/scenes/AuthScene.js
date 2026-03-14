import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';

const AuthScene = ({ onLoginSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({ nickname: '', email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loginAction = useAuthStore((state) => state.login);
  const API_BASE_URL = 'http://localhost:8080';
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
        // [1] 로그인 처리
        const loginRes = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });

        if (loginRes.ok) {
          const meRes = await fetch(`${API_BASE_URL}/api/users/me`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          });

          if (meRes.ok) {
            const userData = await meRes.json();
            loginAction(userData);
            onLoginSuccess();
          } else {
            setErrorMessage('유저 정보를 불러오는데 실패했습니다.');
          }
        } else if (loginRes.status === 401) {
          setErrorMessage('아이디 또는 비밀번호가 올바르지 않습니다.');
        } else {
          setErrorMessage('로그인 처리 중 오류가 발생했습니다.');
        }
      } else {
        // [2] 회원가입 처리
        const signupRes = await fetch(`${API_BASE_URL}/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            nickname: formData.nickname
          })
        });

        if (signupRes.ok) {
          alert('회원가입이 완료되었습니다! 로그인해 주세요.');
          switchMode(true);
        } else if (signupRes.status === 400) {
          setErrorMessage('이미 존재하는 이메일입니다.');
        } else {
          setErrorMessage('회원가입 처리 중 오류가 발생했습니다.');
        }
      }
    } catch (error) {
      setErrorMessage('서버와 통신할 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // [수정] 배경을 단색에서 이미지로 변경
    <div style={{ 
      width: '100%', 
      height: '100%', 
      backgroundImage: `url(${publicPath}/assets/auth/auth_bg.png)`, 
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      imageRendering: 'pixelated',
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center' 
    }}>
      
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="retro-block"
        style={{ 
          width: '450px', 
          height: '460px', 
          padding: '0', 
          display: 'flex', 
          flexDirection: 'column', 
          backgroundColor: 'rgba(0,0,0,0.85)',
          boxShadow: '10px 10px 0px rgba(0,0,0,0.5)',
          border: '4px solid #fff',
          overflow: 'hidden'
        }}
      >
        {/* 상단 탭 (50:50) */}
        <div style={{ display: 'flex', width: '100%', height: '60px', borderBottom: '4px solid #fff' }}>
          <div 
            onClick={() => switchMode(true)}
            style={{ 
              flex: 1, 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '20px', 
              cursor: 'pointer',
              backgroundColor: isLoginMode ? '#fff' : 'transparent',
              color: isLoginMode ? '#000' : '#888',
              fontWeight: isLoginMode ? 'bold' : 'normal',
              transition: 'background-color 0.2s, color 0.2s'
            }}
          >
            LOGIN
          </div>
          <div style={{ width: '4px', backgroundColor: '#fff' }}></div>
          <div 
            onClick={() => switchMode(false)}
            style={{ 
              flex: 1, 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '20px', 
              cursor: 'pointer',
              backgroundColor: !isLoginMode ? '#fff' : 'transparent',
              color: !isLoginMode ? '#000' : '#888',
              fontWeight: !isLoginMode ? 'bold' : 'normal',
              transition: 'background-color 0.2s, color 0.2s'
            }}
          >
            SIGN UP
          </div>
        </div>

        {/* 폼 영역 */}
        <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            {/* [수정] 1. 닉네임 입력란 (가장 위로 이동, 로그인 시 빈 공간 유지) */}
            <div style={{ height: '51px', overflow: 'hidden' }}>
              <AnimatePresence>
                {!isLoginMode && (
                  <motion.input 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    type="text" 
                    name="nickname" 
                    placeholder="닉네임 (Nickname)" 
                    value={formData.nickname} 
                    onChange={handleChange}
                    style={{ width: '100%', height: '51px', padding: '12px', fontSize: '16px', border: '3px solid #fff', backgroundColor: '#333', color: '#fff', outline: 'none' }}
                    required
                  />
                )}
              </AnimatePresence>
            </div>

            {/* [수정] 2. 이메일 (두 번째로 이동) */}
            <input 
              type="email" 
              name="email" 
              placeholder="이메일 (Email)" 
              value={formData.email} 
              onChange={handleChange}
              style={{ padding: '12px', fontSize: '16px', border: '3px solid #fff', backgroundColor: '#333', color: '#fff', outline: 'none' }}
              required
            />

            {/* [수정] 3. 비밀번호 (세 번째 유지) */}
            <input 
              type="password" 
              name="password" 
              placeholder="비밀번호 (Password)" 
              value={formData.password} 
              onChange={handleChange}
              style={{ padding: '12px', fontSize: '16px', border: '3px solid #fff', backgroundColor: '#333', color: '#fff', outline: 'none' }}
              required
            />
          </form>

          {/* 하단 버튼 및 에러 메시지 영역 */}
          <div>
            <div style={{ height: '24px', textAlign: 'center', marginBottom: '10px' }}>
              {errorMessage && <span style={{ color: '#ff4b4b', fontSize: '14px' }}>{errorMessage}</span>}
            </div>

            <button 
              onClick={handleSubmit}
              className="pixel-btn" 
              disabled={isLoading}
              style={{ padding: '15px', fontSize: '20px', width: '100%' }}
            >
              {isLoading ? '통신 중...' : (isLoginMode ? '접속하기' : '가입완료')}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthScene;