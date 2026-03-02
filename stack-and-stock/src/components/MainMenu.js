 import React from 'react';

const MainMenu = ({ onStart }) => {
  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', justifyContent: 'center', 
      alignItems: 'center', height: '100%', color: 'white' 
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '60px' }}>나우유씨미: 런타임에러</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <button className="pixel-btn" onClick={onStart}>새 게임 시작하기</button>
        <button className="pixel-btn" disabled style={{ opacity: 0.5 }}>이어하기 (준비중)</button>
      </div>
    </div>
  );
};

export default MainMenu;