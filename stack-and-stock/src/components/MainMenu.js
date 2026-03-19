import React, { useState, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen'; 
import { motion, AnimatePresence } from 'framer-motion';
import { gameApi } from '../api/gameApi';
import useGameStore from '../store/useGameStore'; 
import '../styles/UIComponents.css'; 
import '../styles/MainMenu.css';    

const MainMenu = ({ onStart, onTestEnding, onTestEvent, user, onLogout }) => {
  const bgSequence = [1, 2, 3, 4, 5, 6, 7, 8, 7, 6, 5, 4, 3, 2];
  const logoSequence = [1, 2, 3, 4, 5, 4, 3, 6, 6, 7];

  const [bgIndex, setBgIndex] = useState(0);
  const [logoIndex, setLogoIndex] = useState(0);
  const [prevBgFrame, setPrevBgFrame] = useState(bgSequence[0]);
  const [prevLogoFrame, setPrevLogoFrame] = useState(logoSequence[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const publicPath = process.env.PUBLIC_URL;
  const loadingBgImage = `${publicPath}/assets/auth/auth_bg.png`;
  
  // 💡 [추가] setDemoMode 가져오기
  const { initNewGame, setDailyStartData, showToast, setDemoMode } = useGameStore();
  const hasSaveData = user?.canContinue === true; 

  useEffect(() => {
    const timer = setInterval(() => {
      setPrevBgFrame(bgSequence[bgIndex]);
      setBgIndex((prev) => (prev + 1) % bgSequence.length);
      setPrevLogoFrame(logoSequence[logoIndex]);
      setLogoIndex((prev) => (prev + 1) % logoSequence.length);
    }, 250);
    return () => clearInterval(timer);
  }, [bgIndex, logoIndex]);

  const executeStartGame = async () => {
    setIsLoading(true); 
    setShowWarningModal(false);
    try {
      setDemoMode(false); // 💡 일반 게임이므로 데모 모드 끄기
      const response = await gameApi.startGame();
      initNewGame(response);

      const dailyData = await gameApi.getDailyStart(response.runId);
      setDailyStartData(dailyData); 

      onStart(); 
    } catch (error) {
      console.error("게임 시작 통신 에러:", error);
      alert("게임을 생성할 수 없습니다. 서버 상태를 확인해 주세요.");
    } finally {
      setIsLoading(false); 
    }
  };

  // 💡 [추가] 데모 플레이 시작 로직
  const handleDemoPlay = async () => {
    setIsLoading(true); 
    try {
      setDemoMode(true); // 💡 데모 모드 켜기! (이후 API 통신은 demoApi.js로 빠짐)
      const response = await gameApi.startGame();
      initNewGame(response);

      const dailyData = await gameApi.getDailyStart(response.runId);
      setDailyStartData(dailyData); 

      onStart(); 
    } catch (error) {
      alert("데모 게임을 실행할 수 없습니다.");
    } finally {
      setIsLoading(false); 
    }
  };

  const handleNewGameClick = () => {
    if (hasSaveData) {
      setShowWarningModal(true); 
    } else {
      executeStartGame(); 
    }
  };

  const handleContinueGame = async () => {
    setIsLoading(true); 
    try {
      setDemoMode(false); // 💡 이어하기도 일반 모드
      const continueInfo = await gameApi.continueRun();
      const dailyData = await gameApi.getDailyStart(continueInfo.runId);
      
      initNewGame({
        runId: continueInfo.runId,
        dayNo: dailyData.portfolio.currentDayNo,
        cashBalance: dailyData.portfolio.cashBalance,
        apRemaining: continueInfo.apRemaining
      });
      setDailyStartData(dailyData);
      
      if (dailyData.randomEventId === 9) {
        showToast("양심의 가책을 느껴, 기운이 없습니다...", "error");
      }
      
      onStart(); 
    } catch (error) {
      console.error("이어하기 실패:", error);
      alert("게임 데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="main-menu-container">
      
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen bgImage={loadingBgImage} text="NOW LOADING..." />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showWarningModal && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              style={{ 
                backgroundColor: '#12121c', border: '6px solid #e55039', padding: '35px 25px', 
                borderRadius: '0px', textAlign: 'center', width: '450px', boxShadow: '8px 8px 0px rgba(0,0,0,1)' 
              }}>
              <h2 style={{ color: '#e55039', marginBottom: '20px', fontSize: '28px', textShadow: '2px 2px 0px #000' }}>[ 경 고 ]</h2>
              <p style={{ color: '#d1d8e0', fontSize: '18px', lineHeight: '1.6', marginBottom: '35px', wordBreak: 'keep-all' }}>
                진행 중인 게임 데이터가 존재합니다.<br/>새 게임을 시작하면 <br/>
                <span style={{ color: '#ff6b6b', fontWeight: 'bold' }}>기존 데이터는 완전히 삭제되며</span> 복구할 수 없습니다.<br/><br/>
                정말 새로 시작하시겠습니까?
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <button className="retro-block" onClick={executeStartGame} style={{ width: '140px', height: '50px', backgroundColor: '#e55039', color: '#fff', fontSize: '16px' }}>새로 시작</button>
                <button className="retro-block" onClick={() => setShowWarningModal(false)} style={{ width: '140px', height: '50px', backgroundColor: '#555', color: '#fff', fontSize: '16px', borderColor: '#333' }}>취 소</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="main-bg-layer">
        <img src={`${publicPath}/assets/main/bg/main_bg_${prevBgFrame}.png`} alt="buffer" className="base-img static-buffer" />
        <AnimatePresence mode="popLayout">
          <motion.img key={`bg-${bgSequence[bgIndex]}`} src={`${publicPath}/assets/main/bg/main_bg_${bgSequence[bgIndex]}.png`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="base-img" />
        </AnimatePresence>
      </div>

      <div className="main-logo-layer">
        <img src={`${publicPath}/assets/main/logo/main_logo_${prevLogoFrame}.png`} alt="buffer" className="main-title-logo static-buffer" />
        <AnimatePresence mode="popLayout">
          <motion.img key={`logo-${logoSequence[logoIndex]}`} src={`${publicPath}/assets/main/logo/main_logo_${logoSequence[logoIndex]}.png`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="main-title-logo" />
        </AnimatePresence>
      </div>

      <div className="user-profile-container">
        <div className="profile-block" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
           <img src={`${publicPath}/assets/ui/user_icon.png`} alt="user" className="profile-icon-img" 
                onError={(e) => e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJDMiAyIDIgMTIgMiAxMnMxMCAxMCAxMCAxMHMxMC0xMCAxMC0xMFMyMiAyIDEyIDJ6bTAgNWMxLjY2IDAgMyAxLjM0IDMgM3MtMS4zNCAzLTMgMy0zLTEuMzQtMy0zIDEuMzQtMyAzLTN6bTAgMTJjLTIuNjcgMC04IDEuMzMtOCA0djJoMTZ2LTJjMC0yLjY3LTUuMzMtNC04LTR6Ii8+PC9zdmc+'}/>
        </div>
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="profile-dropdown">
              <div className="user-name-tag">{user ? `${user.nickname} 님` : "Guest"}</div>
              <button className="logout-btn" onClick={onLogout}>LOGOUT</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="main-ui-layer">
        <div className="main-button-group">
          
          <button className="retro-block menu-btn-custom" onClick={handleNewGameClick} disabled={isLoading}>
            {isLoading ? '[ 통신 중... ]' : '[ 새 게임 시작하기 ]'}
          </button>
          
          <button 
            className="retro-block menu-btn-custom continue-btn" onClick={handleContinueGame} disabled={!hasSaveData || isLoading}
            style={{ backgroundColor: hasSaveData ? '' : '#333', color: hasSaveData ? '#fff' : '#666', border: hasSaveData ? '' : '3px solid #222', cursor: hasSaveData ? '' : 'not-allowed', boxShadow: hasSaveData ? '2px 2px 0 #000' : 'none' }}
          >
            {hasSaveData ? '[ 이어하기 ]' : '[ 이어하기 ]'}
          </button>
          
          {/* 💡 [추가] 데모 플레이 버튼 (초록색 포인트) */}
          <button 
            className="retro-block menu-btn-custom" onClick={handleDemoPlay} disabled={isLoading}
            style={{ backgroundColor: '#27ae60', border: '3px solid #1e8449', marginTop: '10px' }}
          >
            [ 데모 플레이 (5Days) ]
          </button>
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button className="retro-block" style={{ width: '155px', height: '50px', fontSize: '14px', color: '#aaa' }} onClick={onTestEnding}>엔딩 테스트</button>
            <button className="retro-block" style={{ width: '155px', height: '50px', fontSize: '14px', color: '#aaa' }} onClick={onTestEvent}>이벤트 테스트</button>
          </div>
        </div>
        <p className="copyright" style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
          © 2026 Team SSAFY 14th. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default MainMenu;