import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './styles/App.css';

import useAuthStore from './store/useAuthStore';

import LoadingScene from './scenes/LoadingScene';
import AuthScene from './scenes/AuthScene'; 
import MainMenu from './components/MainMenu';
import IntroStory from './scenes/IntroStory';
import GamePlay from './scenes/GamePlay';
import EndingScene from './scenes/EndingScene';
import EventScene from './scenes/EventScene';

function App() {
  const [scene, setScene] = useState('LOADING');
  const [testEndingType, setTestEndingType] = useState(null);
  const [testEventType, setTestEventType] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // 💡 [수정] 백엔드 데이터 스펙에 맞춰 holdings와 tradeLogs(배열), runId를 추가했습니다.
  const [gameData, setGameData] = useState({
    runId: null,
    day: 1,
    period: 'MORNING',
    money: 250000,
    energy: 2,
    holdings: [],
    tradeLogs: []
  });

  const { user, login, logout } = useAuthStore();
  const API_BASE_URL = 'http://localhost:8080';

  const showGlobalToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 1500);
  };

  const checkSessionAndNavigate = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/me`, {
        method: 'GET',
        credentials: 'include', 
      });

      if (res.ok) {
        const userData = await res.json();
        login(userData);
        setScene('MAIN');
      } else {
        setScene('AUTH');
      }
    } catch (error) {
      console.error('서버 통신 실패:', error);
      setScene('AUTH');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (e) {
      console.error('로그아웃 에러:', e);
    } finally {
      logout();
      showGlobalToast("안전하게 로그아웃 되었습니다!");
      setScene('AUTH'); 
    }
  };

  const resetGame = () => {
    setGameData({ runId: null, day: 1, period: 'MORNING', money: 250000, energy: 2, holdings: [], tradeLogs: [] });
    setTestEndingType(null);
    setTestEventType(null);
    setScene('MAIN');
  };

  const startEndingTest = (type) => {
    setTestEndingType(type);
    setScene('ENDING');
  };

  const startEventTest = (type) => {
    setTestEventType(null);
    setTimeout(() => {
      setTestEventType(type);
      setScene('EVENT_SCENE');
    }, 10);
  };

  return (
    <div className="game-container" style={{ position: 'relative' }}>
      
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ y: -50, x: '-50%', opacity: 0 }}
            animate={{ y: 40, x: '-50%', opacity: 1 }}
            exit={{ y: -50, x: '-50%', opacity: 0 }}
            style={{
              position: 'absolute', top: 0, left: '50%',
              padding: '15px 30px', backgroundColor: '#e74c3c', border: '4px solid #c0392b',
              color: '#fff', fontSize: '18px', fontWeight: 'bold', borderRadius: '8px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.5)', zIndex: 9999 
            }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {scene === 'LOADING' && (
          <motion.div key="loading" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="scene-wrapper">
            <LoadingScene onComplete={checkSessionAndNavigate} />
          </motion.div>
        )}

        {scene === 'AUTH' && (
          <motion.div key="auth" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="scene-wrapper">
            <AuthScene onLoginSuccess={() => setScene('MAIN')} />
          </motion.div>
        )}
        
        {scene === 'MAIN' && (
          <motion.div key="main" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="scene-wrapper">
            <MainMenu 
              // 💡 [수정] MainMenu에서 받은 초기 데이터를 gameData에 주입합니다!
              onStart={(startData) => {
                setGameData(prev => ({ ...prev, ...startData }));
                setScene('INTRO');
              }} 
              onTestEnding={() => setScene('ENDING_TEST')}
              onTestEvent={() => setScene('EVENT_TEST')}
              user={user} 
              onLogout={handleLogout} 
            />
          </motion.div>
        )}

        {scene === 'ENDING_TEST' && (
          <motion.div key="ending_test" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="scene-wrapper">
            <div style={{ width: '100%', height: '100%', backgroundColor: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
              <h2 style={{ color: '#fff', marginBottom: '20px' }}>엔딩 결과 테스트 페이지</h2>
              <button className="retro-block" style={{ width: '400px', height: '50px', color: '#fff' }} onClick={() => startEndingTest('GREAT_SUCCESS')}>1. 대 성공 - 주식 천재</button>
              <button className="retro-block" style={{ width: '400px', height: '50px', color: '#fff' }} onClick={() => startEndingTest('SUCCESS')}>2. 성공 - 성실한 투자자</button>
              <button className="retro-block" style={{ width: '400px', height: '50px', color: '#fff' }} onClick={() => startEndingTest('FAIL')}>3. 실패 - 그런 시기도 있는 거죠...</button>
              <button className="retro-block" style={{ width: '400px', height: '50px', color: '#fff' }} onClick={() => startEndingTest('BANKRUPT')}>4. 대 실패 - 파산</button>
              <button className="retro-block" style={{ width: '400px', height: '50px', color: '#fff' }} onClick={() => startEndingTest('HIDDEN_STUDY')}>5. 히든 - ㅎㅎ... 공부하기 싫어</button>
              <button className="retro-block" style={{ width: '400px', height: '50px', color: '#fff' }} onClick={() => startEndingTest('HIDDEN_LUCK')}>6. 히든 - 100억 버튼?!</button>
              <button className="pixel-btn" style={{ marginTop: '20px' }} onClick={() => setScene('MAIN')}>뒤로 가기</button>
            </div>
          </motion.div>
        )}

        {scene === 'EVENT_TEST' && (
          <motion.div key="event_test" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="scene-wrapper">
            <div style={{ width: '100%', height: '100%', backgroundColor: '#1e3a5f', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
              <h2 style={{ color: '#fff', marginBottom: '20px' }}>이벤트 씬 테스트 페이지</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <button className="retro-block" style={{ width: '300px', height: '50px', color: '#fff' }} onClick={() => startEventTest('LOTTERY')}>복권 (선택형)</button>
                <button className="retro-block" style={{ width: '300px', height: '50px', color: '#fff' }} onClick={() => startEventTest('JOB')}>꿀알바 (선택형)</button>
                <button className="retro-block" style={{ width: '300px', height: '50px', color: '#fff' }} onClick={() => startEventTest('ILLEGAL')}>은밀한 알바 (선택형)</button>
                <button className="retro-block" style={{ width: '300px', height: '50px', color: '#fff' }} onClick={() => startEventTest('LOST_ITEM')}>습득물 (선택형)</button>
                <button className="retro-block" style={{ width: '300px', height: '50px', color: '#fff' }} onClick={() => startEventTest('BUTTON_100')}>백억 버튼 (선택형)</button>
                <button className="retro-block" style={{ width: '300px', height: '50px', color: '#fff', backgroundColor: '#2c5364' }} onClick={() => startEventTest('ALLOWANCE')}>뜻밖의 용돈 (단발형)</button>
                <button className="retro-block" style={{ width: '300px', height: '50px', color: '#fff', backgroundColor: '#2c5364' }} onClick={() => startEventTest('GOODS_SALE')}>스타 굿즈 판매 (단발형)</button>
                <button className="retro-block" style={{ width: '300px', height: '50px', color: '#fff', backgroundColor: '#8b0000' }} onClick={() => startEventTest('POLICE_ARREST')}>경찰 체포 (단발형)</button>
              </div>
              <button className="pixel-btn" style={{ marginTop: '20px' }} onClick={() => setScene('MAIN')}>뒤로 가기</button>
            </div>
          </motion.div>
        )}

        {scene === 'EVENT_SCENE' && (
          <motion.div key="event_scene" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="scene-wrapper">
            <EventScene onComplete={() => setScene('MAIN')} eventType={testEventType} />
          </motion.div>
        )}

        {scene === 'INTRO' && (
          <motion.div key="intro" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="scene-wrapper">
            <IntroStory onComplete={() => setScene('PLAY')} />
          </motion.div>
        )}

        {scene === 'PLAY' && (
          <motion.div key="play" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="scene-wrapper">
            <GamePlay 
              data={gameData} 
              onAction={() => {
                setGameData(prev => {
                  if (prev.period === 'MORNING') return { ...prev, period: 'AFTERNOON' };
                  if (prev.day >= 10) { setScene('ENDING'); return prev; }
                  return { ...prev, day: prev.day + 1, period: 'MORNING' };
                });
              }} 
              onGoMain={() => setScene('MAIN')} 
            />
          </motion.div>
        )}

        {scene === 'ENDING' && (
          <motion.div key="ending" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="scene-wrapper">
            <EndingScene onRestart={resetGame} forcedType={testEndingType} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;