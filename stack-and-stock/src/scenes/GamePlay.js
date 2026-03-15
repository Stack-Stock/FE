import React, { useState } from 'react';
import StatusBar from '../components/StatusBar';
import BottomPanel from '../components/BottomPanel';
import StockModal from '../components/StockModal';
import NewsModal from '../components/NewsModal';
import RoomAssets from '../components/RoomAssets'; 

const GamePlay = ({ data, onAction, onGoMain }) => {
  const [hoveredObject, setHoveredObject] = useState(null);
  const [isStockOpen, setIsStockOpen] = useState(false);
  const [isNewsOpen, setIsNewsOpen] = useState(false);

  const FINAL_BG_X = 0;      
  const FINAL_BG_Y = -65;      
  const FINAL_BG_SCALE = 100; 

  const FINAL_ASSET_CONFIG = {
    WINDOW: { x: 480, y: 40, w: 230, h: 150, scale: 155 },
    TV: { x: 240, y: 160, w: 140, h: 100, scale: 240 },
    BED: { x: 743, y: 206, w: 206, h: 141, scale: 293 },
    DESK: { x: -270, y: 340, w: 900, h: 225, scale: 143 },
    NEWSPAPER: { x: 468, y: 361, w: 83, h: 45, scale: 191 },
    PHONE: { x: 192, y: 353, w: 330, h: 374, scale: 26 },
    LAPTOP: { x: 277, y: 278, w: 75, h: 62, scale: 272 },
  };

  // 데이터가 없을 때를 대비한 안전망 (에러 방지)
  const safeData = data || {};
  const publicPath = process.env.PUBLIC_URL;
  const timePeriod = safeData.period === 'MORNING' ? 'morning' : 'night';
  const bgImage = `${publicPath}/assets/bg/bg_${timePeriod}.png`;

  const handleInteract = (id) => {
    if (id === 'BED') onAction();
    if (id === 'NEWSPAPER') setIsNewsOpen(true);
  };

  // 💡 [추가] 둥근 원형 버튼 스타일 정의
  const circleBtnStyle = {
    width: '45px', height: '45px', borderRadius: '50%',
    border: '3px solid #000', color: '#fff', fontWeight: 'bold', fontSize: '20px',
    cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center',
    boxShadow: '2px 2px 0px rgba(0,0,0,0.5)'
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#000', boxSizing: 'border-box', position: 'relative' }}>
      
      <StatusBar data={safeData} />

      <div style={{ 
        flex: 1, position: 'relative', 
        backgroundColor: timePeriod === 'morning' ? '#87CEEB' : '#2c3e50',
        backgroundImage: `url(${bgImage})`, backgroundRepeat: 'no-repeat',
        backgroundPosition: `${FINAL_BG_X}px ${FINAL_BG_Y}px`, backgroundSize: `${FINAL_BG_SCALE}%`,
        imageRendering: 'pixelated', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden'
      }}>
        
        {/* 💡 [추가] 우측 상단 기능 버튼 (포트폴리오, 도움말) */}
        <div style={{ position: 'absolute', top: '20px', right: '30px', display: 'flex', gap: '15px', zIndex: 1000 }}>
          <button 
            style={{ ...circleBtnStyle, backgroundColor: '#4a90e2' }} 
            onClick={() => console.log('포트폴리오 오픈!')} // 팝업 연결 대기
          >
            P
          </button>
          <button 
            style={{ ...circleBtnStyle, backgroundColor: '#e74c3c' }}
            onClick={() => console.log('튜토리얼 오픈!')} // 팝업 연결 대기
          >
            ?
          </button>
        </div>

        <RoomAssets 
          config={FINAL_ASSET_CONFIG}
          period={timePeriod}
          hoveredObject={hoveredObject}
          onHover={setHoveredObject}
          onInteract={handleInteract}
        />
        
      </div>

      {/* 💡 [핵심] hoveredObject를 BottomPanel로 넘겨줍니다! */}
      <BottomPanel 
        data={safeData}
        hoveredObject={hoveredObject}
        isNewsOpen={isNewsOpen}
        onHover={setHoveredObject}
        onAction={onAction}
        onNewsClick={() => setIsNewsOpen(true)}
      />

      <StockModal isOpen={isStockOpen} onClose={() => setIsStockOpen(false)} money={safeData.money} onBuy={() => {}} />
      <NewsModal isOpen={isNewsOpen} onClose={() => setIsNewsOpen(false)} day={safeData.day || 10} />

    </div>
  );
};

export default GamePlay;