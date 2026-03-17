import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './styles/App.css';

// 💡 스토어 가져오기
import useAuthStore from './store/useAuthStore';
import useGameStore from './store/useGameStore'; // 신규 게임 스토어 임포트
import { gameApi } from './api/gameApi'; // 💡 [추가] gameApi 임포트 필수!

// 씬 컴포넌트들
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

  // 💡 [핵심 수정] 무거운 gameData 상태가 삭제되었습니다!
  // 대신 스토어에서 상태와 액션을 직접 꺼내옵니다.
  const { period, day, nextPeriod, resetGame, runId, setDailyStartData } = useGameStore();

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

  const handleResetGame = () => {
    resetGame(); // 💡 스토어 초기화 액션 호출
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
              // 💡 [수정] 데이터 저장은 MainMenu 내부에서 스토어 액션으로 알아서 하므로, 여기서는 그냥 씬 전환만 합니다!
              onStart={() => setScene('INTRO')} 
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
              // 💡 [핵심 수정] 침대를 눌렀을 때의 동작
              onAction={async () => {
                if (period === 'MORNING') {
                  nextPeriod(); // 아침 -> 저녁으로 시간대 변경
                } else {
                  if (day >= 10) { 
                    setScene('ENDING'); 
                  } else {
                    // 🌙 [나중에 추가할 곳] 수면 트랜지션 (화면 암전 등) 시작

                    try {
                      // 1. 백엔드에 수면(하루 종료) 요청!
                      const actionRes = await gameApi.executeAction('SLEEP');
                      console.log("수면 처리 완료:", actionRes.message);

                      // 2. 수면이 완료되었으므로, 다음 날(ex: 2일 차) 데이터 싹 긁어오기!
                      const nextDayData = await gameApi.getDailyStart(runId);
                      console.log("다음 날 데이터 수신:", nextDayData);
                      
                      // 3. 긁어온 데이터를 전역 스토어에 냅다 들이붓기 (알아서 화면이 2일 차로 바뀜!)
                      setDailyStartData(nextDayData);
                      
                      // 안내 메시지
                      showGlobalToast(`${nextDayData.portfolio.currentDayNo}일 차 아침이 밝았습니다!`);

                      // ☀️ [나중에 추가할 곳] 수면 트랜지션 해제 (화면 밝아짐)

                    } catch (error) {
                      console.error("다음 날 넘어가기 실패:", error);
                      showGlobalToast("수면 처리 중 서버 통신 에러가 발생했습니다.");
                    }
                  }
                }
              }} 
              onGoMain={() => setScene('MAIN')} 
            />
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