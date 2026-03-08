import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MainMenu = ({ onStart }) => {
  const sequence = [1, 2, 3, 4, 5, 6, 7, 8, 7, 6, 5, 4, 3, 2];
  const [index, setIndex] = useState(0);
  const [prevFrame, setPrevFrame] = useState(sequence[0]); // 이전 프레임 기억
  const publicPath = process.env.PUBLIC_URL;

  useEffect(() => {
    const timer = setInterval(() => {
      // 현재 프레임을 '이전 프레임'으로 저장하고 다음으로 이동
      setPrevFrame(sequence[index]);
      setIndex((prev) => (prev + 1) % sequence.length);
    }, 250);

    return () => clearInterval(timer);
  }, [index, sequence]);

  const currentFrame = sequence[index];

  return (
    <div className="main-menu-container">
      {/* 1. 배경 애니메이션 레이어 */}
      <div className="main-bg-layer">
        {/* 하단에 '이전 프레임'을 깔아두어 검은 배경 노출 방지 */}
        <img 
          src={`${publicPath}/assets/main/bg/main_bg_${prevFrame}.png`} 
          alt="bg-buffer" 
          className="base-img static-buffer"
        />
        <AnimatePresence mode="popLayout">
          <motion.img
            key={`bg-${currentFrame}`}
            src={`${publicPath}/assets/main/bg/main_bg_${currentFrame}.png`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "linear" }} // 전환 시간 최적화
            className="base-img"
          />
        </AnimatePresence>
      </div>

      {/* 2. 로고 애니메이션 레이어 */}
      <div className="main-logo-layer">
        {/* 로고 역시 버퍼를 깔아주면 테두리 떨림이 사라집니다 */}
        <img 
          src={`${publicPath}/assets/main/logo/main_logo_${prevFrame}.png`} 
          alt="logo-buffer" 
          className="main-title-logo static-buffer"
        />
        <AnimatePresence mode="popLayout">
          <motion.img
            key={`logo-${currentFrame}`}
            src={`${publicPath}/assets/main/logo/main_logo_${currentFrame}.png`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "linear" }}
            className="main-title-logo"
          />
        </AnimatePresence>
      </div>

      {/* 3. UI 버튼 레이어 */}
      <div className="main-ui-layer">
        <div className="button-group">
          <button className="pixel-btn" onClick={onStart}>
            새 게임 시작하기
          </button>
          <button className="pixel-btn" disabled style={{ opacity: 0.5 }}>
            이어하기 (준비중)
          </button>
        </div>
        <p className="copyright">© 2026 Team SSAFY 14th. All rights reserved.</p>
      </div>
    </div>
  );
};

export default MainMenu;