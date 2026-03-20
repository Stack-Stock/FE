import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './styles/App.css';

import useAuthStore from './store/useAuthStore';
import useGameStore from './store/useGameStore'; 
import { gameApi } from './api/gameApi'; 

// 씬 컴포넌트들
import LoadingScene from './scenes/LoadingScene';
import AuthScene from './scenes/AuthScene'; 
import MainMenu from './components/MainMenu';
import IntroStory from './scenes/IntroStory';
import GamePlay from './scenes/GamePlay';
import EndingScene from './scenes/EndingScene';
import EventScene from './scenes/EventScene';
import SchoolTransition from './components/SchoolTransition'; 
import SleepTransition from './components/SleepTransition';
import EndingTransition from './components/EndingTransition'; // 💡 [추가] 엔딩 트랜지션 가져오기

function App() {
  const [scene, setScene] = useState('LOADING');
  const [testEndingType, setTestEndingType] = useState(null);
  const [currentEventType, setCurrentEventType] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const { period, day, nextPeriod, resetGame, runId, setDailyStartData, todayEventId, setEndingType } = useGameStore();
  const { user, login, logout } = useAuthStore();
  const API_BASE_URL = 'http://localhost:8080';

  const mapEventIdToType = (eventId) => {
    const eventMap = {
      1: 'LOTTERY',       
      2: 'JOB',           
      3: 'ILLEGAL',       
      4: 'LOST_ITEM',     
      5: 'BUTTON_100',    
      6: 'ALLOWANCE',     
      7: 'GOODS_SALE',    
      8: 'POLICE_ARREST', 
      9: 'NORMAL_DAY',
      10: 'DEMO_LOTTERY'         
    };
    return eventMap[eventId] || 'NORMAL_DAY'; 
  };

  const showGlobalToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 1500);
  };

  const checkSessionAndNavigate = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/me`, {
        method: 'GET', credentials: 'include', 
      });
      if (res.ok) {
        const userData = await res.json();
        login(userData);
        setScene('MAIN');
      } else setScene('AUTH');
    } catch (error) {
      setScene('AUTH');
    }
  };

  const handleLogout = async () => {
    try { await fetch(`${API_BASE_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' }); } 
    catch (e) {} 
    finally {
      logout();
      showGlobalToast("안전하게 로그아웃 되었습니다!");
      setScene('AUTH'); 
    }
  };

  // 💡 [핵심 수정] 엔딩 후 메인으로 돌아갈 때 유저 정보(canContinue)를 최신화합니다.
  const handleResetGame = async () => {
    resetGame(); 
    setTestEndingType(null);
    setCurrentEventType(null); 
    
    // 메인으로 가기 전, 이어하기 상태를 갱신하기 위해 유저 정보 API 재호출
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/me`, {
        method: 'GET', credentials: 'include', 
      });
      if (res.ok) {
        const userData = await res.json();
        login(userData); // 💡 스토어에 갱신된 정보(canContinue: false 등) 덮어쓰기
      }
    } catch (error) {
      console.error("유저 정보 갱신 실패", error);
    }

    setScene('MAIN');
  };

  const startEndingTest = (type) => {
    setTestEndingType(type);
    setScene('ENDING');
  };

  const startEventTest = (type) => {
    setCurrentEventType(type);
    setScene('SCHOOL_TRANSITION'); 
  };

  const handleTransitionComplete = () => {
    if (currentEventType === 'NORMAL_DAY') {
      if (runId) {
         nextPeriod(); 
         setScene('PLAY');
      } else {
         setScene('MAIN');
      }
    } else {
      setScene('EVENT_SCENE'); 
    }
  };

  const handleEventComplete = () => {
    if (runId) {
      nextPeriod(); 
      setScene('PLAY');
    } else {
      setScene('MAIN');
    }
  };

  const handleSleepComplete = () => {
    setScene('PLAY'); 
    if (todayEventId === 9) {
      showGlobalToast("양심의 가책을 느껴, 기운이 없습니다...");
    } else {
      showGlobalToast(`${day}일 차 아침이 밝았습니다!`);
    }
  };

  return (
    <div className="game-container" style={{ position: 'relative' }}>
      
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ y: -50, x: '-50%', opacity: 0 }} animate={{ y: 40, x: '-50%', opacity: 1 }} exit={{ y: -50, x: '-50%', opacity: 0 }}
            style={{ position: 'absolute', top: 0, left: '50%', padding: '15px 30px', backgroundColor: '#e74c3c', border: '4px solid #c0392b', color: '#fff', fontSize: '18px', fontWeight: 'bold', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.5)', zIndex: 9999 }}
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
            <MainMenu onStart={() => setScene('INTRO')} onTestEnding={() => setScene('ENDING_TEST')} onTestEvent={() => setScene('EVENT_TEST')} user={user} onLogout={handleLogout} />
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
                <button className="retro-block" style={{ width: '300px', height: '50px', color: '#fff', backgroundColor: '#2ed573' }} onClick={() => startEventTest('NORMAL_DAY')}>평범한 등교 (단발형)</button>
              </div>
              <button className="pixel-btn" style={{ marginTop: '20px' }} onClick={() => setScene('MAIN')}>뒤로 가기</button>
            </div>
          </motion.div>
        )}

        {scene === 'SCHOOL_TRANSITION' && (
          <motion.div key="school_transition" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="scene-wrapper">
            <SchoolTransition targetEvent={currentEventType} onComplete={handleTransitionComplete} />
          </motion.div>
        )}

        {scene === 'SLEEP_TRANSITION' && (
          <motion.div key="sleep_transition" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="scene-wrapper">
            <SleepTransition day={day} onComplete={handleSleepComplete} />
          </motion.div>
        )}

        {scene === 'EVENT_SCENE' && (
          <motion.div key="event_scene" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="scene-wrapper">
            <EventScene onComplete={handleEventComplete} eventType={currentEventType} />
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
              onAction={async () => {
                if (period === 'MORNING') {
                  const eventTypeStr = mapEventIdToType(todayEventId);
                  setCurrentEventType(eventTypeStr);
                  setScene('SCHOOL_TRANSITION');
                } else {
                  try {
                    const sleepResult = await gameApi.executeAction('SLEEP');
                    
                    if (sleepResult.endingType) {
                      setEndingType(sleepResult.endingType);
                      setScene('ENDING_TRANSITION'); 
                    } else {
                      const nextDayData = await gameApi.getDailyStart(runId);
                      setDailyStartData(nextDayData);
                      setScene('SLEEP_TRANSITION'); 
                    }
                  } catch (error) {
                    showGlobalToast("서버 통신 중 오류가 발생했습니다.");
                  }
                }
              }} 
              onGoMain={() => setScene('MAIN')} 
            />
          </motion.div>
        )}

        {scene === 'ENDING_TRANSITION' && (
          <motion.div key="ending_transition" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="scene-wrapper">
            <EndingTransition onComplete={() => setScene('ENDING')} />
          </motion.div>
        )}

        {scene === 'ENDING' && (
          <motion.div key="ending" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="scene-wrapper">
            <EndingScene onRestart={handleResetGame} forcedType={testEndingType} />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

export default App;