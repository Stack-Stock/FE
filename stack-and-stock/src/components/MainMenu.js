import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gameApi } from '../api/gameApi'; // 💡 API 파일 임포트
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
  const [isLoading, setIsLoading] = useState(false); // 💡 통신 상태

  const publicPath = process.env.PUBLIC_URL;

  useEffect(() => {
    const timer = setInterval(() => {
      setPrevBgFrame(bgSequence[bgIndex]);
      setBgIndex((prev) => (prev + 1) % bgSequence.length);
      setPrevLogoFrame(logoSequence[logoIndex]);
      setLogoIndex((prev) => (prev + 1) % logoSequence.length);
    }, 250);
    return () => clearInterval(timer);
  }, [bgIndex, logoIndex]);

  // 💡 [핵심] 게임 시작 API 호출 및 데이터 조립
  const handleStartGame = async () => {
    setIsLoading(true);
    try {
      // 1. 새 게임 생성 API 호출
      const response = await gameApi.startGame();
      
      // 2. 백엔드 스펙에 맞춘 초기 프론트엔드 데이터 세팅
      const initGameData = {
        runId: response.runId,
        day: response.dayNo,
        money: response.cashBalance,
        energy: response.apRemaining,
        period: 'MORNING',
        holdings: [], // 새 게임이므로 보유 주식은 빈 배열
        tradeLogs: [] // 새 게임이므로 거래 로그는 빈 배열
      };

      // 3. App.js로 올려보내 화면 전환!
      onStart(initGameData);
    } catch (error) {
      console.error("게임 시작 통신 에러:", error);
      alert("게임을 생성할 수 없습니다. 서버 상태를 확인해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="main-menu-container">
      <div className="main-bg-layer">
        <img src={`${publicPath}/assets/main/bg/main_bg_${prevBgFrame}.png`} alt="buffer" className="base-img static-buffer" />
        <AnimatePresence mode="popLayout">
          <motion.img key={`bg-${bgSequence[bgIndex]}`} src={`${publicPath}/assets/main/bg/main_bg_${bgSequence[bgIndex]}.png`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }} className="base-img" />
        </AnimatePresence>
      </div>

      <div className="main-logo-layer">
        <img src={`${publicPath}/assets/main/logo/main_logo_${prevLogoFrame}.png`} alt="buffer" className="main-title-logo static-buffer" />
        <AnimatePresence mode="popLayout">
          <motion.img key={`logo-${logoSequence[logoIndex]}`} src={`${publicPath}/assets/main/logo/main_logo_${logoSequence[logoIndex]}.png`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }} className="main-title-logo" />
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
          {/* 💡 [수정] 직접 통신 함수(handleStartGame)를 연결했습니다. */}
          <button className="retro-block menu-btn-custom" onClick={handleStartGame} disabled={isLoading}>
            {isLoading ? '[ 통신 중... ]' : '[ 새 게임 시작하기 ]'}
          </button>
          <button className="retro-block menu-btn-custom continue-btn" disabled>
            [ 이어하기 (준비중) ]
          </button>
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button className="retro-block" style={{ width: '155px', height: '50px', fontSize: '14px', color: '#aaa' }} onClick={onTestEnding}>
              엔딩 테스트
            </button>
            <button className="retro-block" style={{ width: '155px', height: '50px', fontSize: '14px', color: '#aaa' }} onClick={onTestEvent}>
              이벤트 테스트
            </button>
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