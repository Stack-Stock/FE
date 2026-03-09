import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/UIComponents.css'; // 공통 블록 디자인
import '../styles/MainMenu.css';    // 메인 전용 위치 설정

const MainMenu = ({ onStart, onTestEnding, user, onLogout }) => {
  const bgSequence = [1, 2, 3, 4, 5, 6, 7, 8, 7, 6, 5, 4, 3, 2];
  const logoSequence = [1, 2, 3, 4, 5, 4, 3, 6, 6, 7];

  const [bgIndex, setBgIndex] = useState(0);
  const [logoIndex, setLogoIndex] = useState(0);
  const [prevBgFrame, setPrevBgFrame] = useState(bgSequence[0]);
  const [prevLogoFrame, setPrevLogoFrame] = useState(logoSequence[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  return (
    <div className="main-menu-container">
      {/* 1. 배경 & 로고 레이어 (기존 로직 동일) */}
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

      {/* 2. 유저 프로필 (우측 상단) */}
      <div className="user-profile-container">
        <div className="profile-block" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
           <img src={`${publicPath}/assets/ui/user_icon.png`} alt="user" className="profile-icon-img" 
                onError={(e) => e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJDMiAyIDIgMTIgMiAxMnMxMCAxMCAxMCAxMHMxMC0xMCAxMC0xMFMyMiAyIDEyIDJ6bTAgNWMxLjY2IDAgMyAxLjM0IDMgM3MtMS4zNCAzLTMgMy0zLTEuMzQtMy0zIDEuMzQtMyAzLTN6bTAgMTJjLTIuNjcgMC04IDEuMzMtOCA0djJoMTZ2LTJjMC0yLjY3LTUuMzMtNC04LTR6Ii8+PC9zdmc+'}/>
        </div>
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="profile-dropdown">
              <div className="user-name-tag">{user ? `${user.name} 님` : "Guest"}</div>
              <button className="logout-btn" onClick={onLogout}>LOGOUT</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. 시작하기 / 이어하기 버튼 (수정된 디자인 적용) */}
      <div className="main-ui-layer">
        <div className="main-button-group">
          <button className="retro-block menu-btn-custom" onClick={onStart}>
            [ 새 게임 시작하기 ]
          </button>
          <button className="retro-block menu-btn-custom continue-btn" disabled>
            [ 이어하기 (준비중) ]
          </button>
          {/* 엔딩 테스트 버튼 추가 */}
          <button 
            className="retro-block" 
            style={{ width: '320px', height: '50px', fontSize: '18px', color: '#aaa', marginTop: '10px' }} 
            onClick={onTestEnding}
          >
            [ 엔딩 테스트 모드 ]
          </button>
        </div>
        <p className="copyright" style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
          © 2026 Team SSAFY 14th. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default MainMenu;