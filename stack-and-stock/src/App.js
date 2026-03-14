import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './styles/App.css';

// Zustand 스토어 가져오기
import useAuthStore from './store/useAuthStore';

// 씬 컴포넌트들
import LoadingScene from './scenes/LoadingScene';
import AuthScene from './scenes/AuthScene'; // 방금 만든 로그인/회원가입 씬
import MainMenu from './components/MainMenu';
import IntroStory from './scenes/IntroStory';
import GamePlay from './scenes/GamePlay';
import EndingScene from './scenes/EndingScene';
import EventScene from './scenes/EventScene';

function App() {
  // 앱의 현재 화면 상태 (초기값: 로딩)
  const [scene, setScene] = useState('LOADING');
  
  // 엔딩 및 이벤트 테스트용 상태
  const [testEndingType, setTestEndingType] = useState(null);
  const [testEventType, setTestEventType] = useState(null);
  
  // 게임 데이터 상태
  const [gameData, setGameData] = useState({
    day: 1,
    period: 'MORNING',
    money: 250000,
    energy: 2,
  });

  // Zustand에서 유저 정보와 로그인 액션 가져오기
  const { user, login, logout } = useAuthStore();
  const API_BASE_URL = 'http://localhost:8080';

  // [핵심 로직] 로딩 씬이 끝날 때 호출되는 함수: 로그인 상태 체크
  const checkSessionAndNavigate = async () => {
    try {
      // 쿠키를 포함해서 내 정보 조회 API 호출
      const res = await fetch(`${API_BASE_URL}/api/users/me`, {
        method: 'GET',
        credentials: 'include', 
      });

      if (res.ok) {
        // 세션이 유효하다면 유저 정보를 스토어에 저장하고 메인으로 직행!
        const userData = await res.json();
        login(userData);
        setScene('MAIN');
      } else {
        // 세션이 없거나 만료되었다면 로그인 씬으로 이동
        setScene('AUTH');
      }
    } catch (error) {
      console.error('서버 통신 실패:', error);
      // 서버가 꺼져있거나 에러가 나도 일단 로그인 씬으로 보내서 막히지 않게 처리
      setScene('AUTH');
    }
  };

  const handleLogout = async () => {
    try {
      // 백엔드 로그아웃 API 호출 (세션 파기)
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (e) {
      console.error('로그아웃 에러:', e);
    } finally {
      // 백엔드 통신 성공 여부와 상관없이 프론트엔드 상태 초기화
      logout();
      alert("로그아웃 되었습니다.");
      setScene('AUTH'); // 다시 로그인 화면으로
    }
  };

  const resetGame = () => {
    setGameData({ day: 1, period: 'MORNING', money: 250000, energy: 2 });
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
    <div className="game-container">
      <AnimatePresence mode="wait">
        
        {/* 1. 로딩 씬 */}
        {scene === 'LOADING' && (
          <motion.div key="loading" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="scene-wrapper">
            {/* 로딩 연출이 끝나면 세션을 체크하는 함수를 실행합니다 */}
            <LoadingScene onComplete={checkSessionAndNavigate} />
          </motion.div>
        )}

        {/* 2. 로그인 / 회원가입 씬 */}
        {scene === 'AUTH' && (
          <motion.div key="auth" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="scene-wrapper">
            {/* 로그인 성공 시 바로 MAIN으로 보내줍니다 */}
            <AuthScene onLoginSuccess={() => setScene('MAIN')} />
          </motion.div>
        )}
        
        {/* 3. 메인 메뉴 씬 */}
        {scene === 'MAIN' && (
          <motion.div key="main" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="scene-wrapper">
            <MainMenu 
              onStart={() => setScene('INTRO')} 
              onTestEnding={() => setScene('ENDING_TEST')}
              onTestEvent={() => setScene('EVENT_TEST')}
              user={user} // Zustand에서 가져온 실제 유저 정보 전달
              onLogout={handleLogout} 
            />
          </motion.div>
        )}

        {/* 테스트 메뉴 및 기존 게임 씬들 (변경 없음) */}
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