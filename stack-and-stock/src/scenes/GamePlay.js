import React, { useState } from 'react';
import StatusBar from '../components/StatusBar';
import BottomPanel from '../components/BottomPanel';
import StockModal from '../components/StockModal';
import NewsModal from '../components/NewsModal';
import PhoneModal from '../components/PhoneModal';
import TvModal from '../components/TvModal';
import EnergyConfirmModal from '../components/EnergyConfirmModal';
import RoomAssets from '../components/RoomAssets'; 

const GamePlay = ({ data, onAction, onGoMain }) => {
  const [hoveredObject, setHoveredObject] = useState(null);
  
  // 모달 오픈 상태 관리
  const [isStockOpen, setIsStockOpen] = useState(false);
  const [isNewsOpen, setIsNewsOpen] = useState(false);
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const [isTvOpen, setIsTvOpen] = useState(false);
  
  // 💡 [핵심 로직] 행동력 소모 경고창 상태 및 매체 읽은 날짜 기억
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, type: '', cost: 0, title: '' });
  const [lastReadNewsDay, setLastReadNewsDay] = useState(0);
  const [lastWatchedTvDay, setLastWatchedTvDay] = useState(0);

  const safeData = data || {};
  const currentDay = safeData.day || 10;
  const timePeriod = safeData.period === 'MORNING' ? 'morning' : 'night';
  const publicPath = process.env.PUBLIC_URL;
  const bgImage = `${publicPath}/assets/bg/bg_${timePeriod}.png`;

  const FINAL_BG_X = 0, FINAL_BG_Y = -65, FINAL_BG_SCALE = 100; 
  const FINAL_ASSET_CONFIG = {
    WINDOW: { x: 480, y: 40, w: 230, h: 150, scale: 155 },
    TV: { x: 240, y: 160, w: 140, h: 100, scale: 240 },
    BED: { x: 743, y: 206, w: 206, h: 141, scale: 293 },
    DESK: { x: -270, y: 340, w: 900, h: 225, scale: 143 },
    NEWSPAPER: { x: 468, y: 361, w: 83, h: 45, scale: 191 },
    PHONE: { x: 192, y: 353, w: 330, h: 374, scale: 26 },
    LAPTOP: { x: 277, y: 278, w: 75, h: 62, scale: 272 },
  };

  // 💡 사물이든 버튼이든 클릭하면 모두 여기로 들어옵니다!
  const handleInteract = (id) => {
    if (id === 'BED') {
      onAction(); // 잠자기/학교가기 (기존 로직)
    } else if (id === 'LAPTOP') {
      setIsStockOpen(true); // 투자창
    } else if (id === 'PHONE') {
      setIsPhoneOpen(true); // 행동력 0이므로 바로 열림
    } else if (id === 'NEWSPAPER') {
      if (lastReadNewsDay === currentDay) {
        setIsNewsOpen(true); // 오늘 이미 읽었으면 바로 열림
      } else {
        setConfirmConfig({ isOpen: true, type: 'NEWSPAPER', cost: 1, title: '신문' }); // 아니면 경고창 띄움
      }
    } else if (id === 'TV') {
      if (lastWatchedTvDay === currentDay) {
        setIsTvOpen(true); // 오늘 이미 봤으면 바로 열림
      } else {
        setConfirmConfig({ isOpen: true, type: 'TV', cost: 2, title: '티비' }); // 아니면 경고창 띄움
      }
    }
  };

  // 💡 경고창에서 [확인]을 눌렀을 때 실행되는 함수
  const handleConfirmAction = () => {
    // 여기에 나중에 API 연동이나 Zustand 상태를 깎는 코드를 넣으면 됩니다.
    console.log(`[API 연동 대기] 행동력 ${confirmConfig.cost} 소모됨!`);

    if (confirmConfig.type === 'NEWSPAPER') {
      setLastReadNewsDay(currentDay); // 읽은 날짜를 오늘로 갱신
      setIsNewsOpen(true);            // 모달 오픈
    } else if (confirmConfig.type === 'TV') {
      setLastWatchedTvDay(currentDay);
      setIsTvOpen(true);
    }
    setConfirmConfig({ isOpen: false, type: '', cost: 0, title: '' }); // 경고창 닫기
  };

  const circleBtnStyle = {
    width: '45px', height: '45px', borderRadius: '50%', border: '3px solid #000', color: '#fff', 
    fontWeight: 'bold', fontSize: '20px', cursor: 'pointer', display: 'flex', justifyContent: 'center', 
    alignItems: 'center', boxShadow: '2px 2px 0px rgba(0,0,0,0.5)'
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#000', boxSizing: 'border-box', position: 'relative' }}>
      <StatusBar data={safeData} />

      <div style={{ 
        flex: 1, position: 'relative', backgroundColor: timePeriod === 'morning' ? '#87CEEB' : '#2c3e50',
        backgroundImage: `url(${bgImage})`, backgroundRepeat: 'no-repeat', backgroundPosition: `${FINAL_BG_X}px ${FINAL_BG_Y}px`, 
        backgroundSize: `${FINAL_BG_SCALE}%`, imageRendering: 'pixelated', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden'
      }}>
        
        <div style={{ position: 'absolute', top: '20px', right: '30px', display: 'flex', gap: '15px', zIndex: 1000 }}>
          <button style={{ ...circleBtnStyle, backgroundColor: '#4a90e2' }} onClick={() => console.log('포트폴리오 오픈!')}>P</button>
          <button style={{ ...circleBtnStyle, backgroundColor: '#e74c3c' }} onClick={() => console.log('튜토리얼 오픈!')}>?</button>
        </div>

        <RoomAssets config={FINAL_ASSET_CONFIG} period={timePeriod} hoveredObject={hoveredObject} onHover={setHoveredObject} onInteract={handleInteract} />
      </div>

      <BottomPanel data={safeData} hoveredObject={hoveredObject} onHover={setHoveredObject} onInteract={handleInteract} />

      {/* 💡 각종 모달들 렌더링 */}
      <EnergyConfirmModal 
        isOpen={confirmConfig.isOpen} 
        config={confirmConfig}
        onConfirm={handleConfirmAction} 
        onClose={() => setConfirmConfig({ isOpen: false, type: '', cost: 0, title: '' })} 
      />
      <StockModal isOpen={isStockOpen} onClose={() => setIsStockOpen(false)} money={safeData.money} onBuy={() => {}} />
      <NewsModal isOpen={isNewsOpen} onClose={() => setIsNewsOpen(false)} day={currentDay} />
      <PhoneModal isOpen={isPhoneOpen} onClose={() => setIsPhoneOpen(false)} day={currentDay} />
      <TvModal isOpen={isTvOpen} onClose={() => setIsTvOpen(false)} day={currentDay} />

    </div>
  );
};

export default GamePlay;