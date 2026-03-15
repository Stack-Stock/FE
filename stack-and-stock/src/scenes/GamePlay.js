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

  // 배경 위치 고정값
  const FINAL_BG_X = 0;      
  const FINAL_BG_Y = -65;      
  const FINAL_BG_SCALE = 100; 

  // 💡 [핵심] 콘솔에서 추출하신 최종 에셋 설정값을 여기에 덮어쓰세요!
  const FINAL_ASSET_CONFIG = {
    WINDOW: { x: 480, y: 40, w: 230, h: 150, scale: 155 },
    TV: { x: 240, y: 160, w: 140, h: 100, scale: 240 },
    BED: { x: 743, y: 206, w: 206, h: 141, scale: 293 },
    DESK: { x: -270, y: 340, w: 900, h: 225, scale: 143 },
    NEWSPAPER: { x: 468, y: 361, w: 83, h: 45, scale: 191 },
    PHONE: { x: 192, y: 353, w: 330, h: 374, scale: 26 },
    LAPTOP: { x: 277, y: 278, w: 75, h: 62, scale: 272 },
  };

  const publicPath = process.env.PUBLIC_URL;
  const timePeriod = data.period === 'MORNING' ? 'morning' : 'night';
  const bgImage = `${publicPath}/assets/bg/bg_${timePeriod}.png`;

  const handleInteract = (id) => {
    if (id === 'BED') onAction();
    if (id === 'NEWSPAPER') setIsNewsOpen(true);
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#000', boxSizing: 'border-box', position: 'relative' }}>
      
      <StatusBar data={data} />

      <div style={{ 
        flex: 1, 
        position: 'relative', 
        backgroundColor: data.period === 'MORNING' ? '#87CEEB' : '#2c3e50',
        backgroundImage: `url(${bgImage})`, 
        backgroundRepeat: 'no-repeat',
        backgroundPosition: `${FINAL_BG_X}px ${FINAL_BG_Y}px`,
        backgroundSize: `${FINAL_BG_SCALE}%`,
        imageRendering: 'pixelated',
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        
        {/* 개발 툴 관련 props들을 모두 제거하고 깔끔하게 고정값만 넘깁니다 */}
        <RoomAssets 
          config={FINAL_ASSET_CONFIG}
          period={timePeriod}
          hoveredObject={hoveredObject}
          onHover={setHoveredObject}
          onInteract={handleInteract}
        />
        
      </div>

      <BottomPanel 
        isNewsOpen={isNewsOpen}
        onHover={setHoveredObject}
        onAction={onAction}
        onNewsClick={() => setIsNewsOpen(true)}
      />

      <StockModal isOpen={isStockOpen} onClose={() => setIsStockOpen(false)} money={data.money} onBuy={() => {}} />
      <NewsModal isOpen={isNewsOpen} onClose={() => setIsNewsOpen(false)} day={data.day} />

    </div>
  );
};

export default GamePlay;