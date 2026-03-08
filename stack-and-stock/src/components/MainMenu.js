import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/MainMenu.css';

const MainMenu = ({ onStart, user, onLogout }) => {
  const bgSequence = [1, 2, 3, 4, 5, 6, 7, 8, 7, 6, 5, 4, 3, 2];
  const logoSequence = [1, 2, 3, 4, 5, 4, 3, 6, 6, 7];

  const [bgIndex, setBgIndex] = useState(0);
  const [logoIndex, setLogoIndex] = useState(0);
  const [prevBgFrame, setPrevBgFrame] = useState(bgSequence[0]);
  const [prevLogoFrame, setPrevLogoFrame] = useState(logoSequence[0]);
  
  // 유저 드롭다운 상태
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

  const currentBgFrame = bgSequence[bgIndex];
  const currentLogoFrame = logoSequence[logoIndex];

  return (
    <div className="main-menu-container">
      {/* [추가] 우측 상단 유저 정보 섹션 */}
      <div className="user-profile-container">
        <div className="profile-block" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <img src={`${publicPath}/assets/ui/user_icon.png`} alt="user" className="profile-icon-img" 
               onError={(e) => e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJDMiAyIDIgMTIgMiAxMnMxMCAxMCAxMCAxMHMxMC0xMCAxMC0xMFMyMiAyIDEyIDJ6bTAgNWMxLjY2IDAgMyAxLjM0IDMgM3MtMS4zNCAzLTMgMy0zLTEuMzQtMy0zIDEuMzQtMyAzLTN6bTAgMTJjLTIuNjcgMC04IDEuMzMtOCA0djJoMTZ2LTJjMC0yLjY3LTUuMzMtNC04LTR6Ii8+PC9zdmc+'}/>
        </div>
        
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="profile-dropdown"
            >
              <div className="user-name-tag">{user ? `${user.name} 님` : "로그인이 필요합니다"}</div>
              <button className="logout-btn" onClick={onLogout}>LOGOUT</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 배경 레이어 */}
      <div className="main-bg-layer">
        <img src={`${publicPath}/assets/main/bg/main_bg_${prevBgFrame}.png`} alt="bg-buffer" className="base-img static-buffer" />
        <AnimatePresence mode="popLayout">
          <motion.img key={`bg-${currentBgFrame}`} src={`${publicPath}/assets/main/bg/main_bg_${currentBgFrame}.png`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "linear" }} className="base-img" />
        </AnimatePresence>
      </div>

      {/* 로고 레이어 */}
      <div className="main-logo-layer">
        <img src={`${publicPath}/assets/main/logo/main_logo_${prevLogoFrame}.png`} alt="logo-buffer" className="main-title-logo static-buffer" />
        <AnimatePresence mode="popLayout">
          <motion.img key={`logo-${currentLogoFrame}`} src={`${publicPath}/assets/main/logo/main_logo_${currentLogoFrame}.png`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "linear" }} className="main-title-logo" />
        </AnimatePresence>
      </div>

      {/* UI 버튼 레이어 */}
      <div className="main-ui-layer">
        <div className="button-group">
          <button className="pixel-btn" onClick={onStart}>새 게임 시작하기</button>
          <button className="pixel-btn" disabled style={{ opacity: 0.5 }}>이어하기 (준비중)</button>
        </div>
        <p className="copyright">© 2026 Team SSAFY 14th. All rights reserved.</p>
      </div>
    </div>
  );
};

export default MainMenu;