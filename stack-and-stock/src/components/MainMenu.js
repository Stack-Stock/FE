import React, { useState, useEffect } from 'react';

const MainMenu = ({ onStart }) => {
  const [frame, setFrame] = useState(1);
  const publicPath = process.env.PUBLIC_URL;

  // 8개의 프레임을 무한 루프 돌리는 타이머
  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((prev) => (prev % 7) + 1);
    }, 750); // 0.15초마다 이미지 교체 (속도는 취향에 따라 조절 가능)

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="main-menu-container">
      {/* 1. 애니메이션 배경 레이어 */}
      <div className="main-bg-layer">
        <img 
          src={`${publicPath}/assets/main/bg/main_bg_${frame}.jpg`} 
          alt="background animation" 
          className="base-img"
        />
      </div>

      {/* 2. 애니메이션 로고 레이어 */}
      <div className="main-logo-layer">
        <img 
          src={`${publicPath}/assets/main/logo/main_logo_${frame}.png`} 
          alt="title logo animation" 
          className="main-title-logo"
        />
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