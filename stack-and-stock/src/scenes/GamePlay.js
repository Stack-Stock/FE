import React, { useState } from 'react';
import StatusBar from '../components/StatusBar';
import BottomPanel from '../components/BottomPanel';
import StockModal from '../components/StockModal';
import NewsModal from '../components/NewsModal';
import PhoneModal from '../components/PhoneModal';
import TvModal from '../components/TvModal';
import EnergyConfirmModal from '../components/EnergyConfirmModal';
import StudyModal from '../components/StudyModal';
import RoomAssets from '../components/RoomAssets'; 

const GamePlay = ({ data, onAction, onGoMain }) => {
  const [hoveredObject, setHoveredObject] = useState(null);
  const [isStockOpen, setIsStockOpen] = useState(false);
  const [isNewsOpen, setIsNewsOpen] = useState(false);
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const [isTvOpen, setIsTvOpen] = useState(false);
  const [isStudyOpen, setIsStudyOpen] = useState(false); 
  
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, type: '', cost: 0, title: '', actionText: '' });
  
  const [lastReadNewsDay, setLastReadNewsDay] = useState(0);
  const [lastWatchedTvDay, setLastWatchedTvDay] = useState(0);
  const [lastStudiedDay, setLastStudiedDay] = useState(0); 

  // 💡 [신규] 주식 거래 확정 버튼을 눌렀을 때, 행동력 소모 경고창을 통과하기 전까지 임시로 데이터를 담아둘 상태
  const [lastTradedDay, setLastTradedDay] = useState(0);
  const [pendingTradeData, setPendingTradeData] = useState(null);

  const safeData = data || {};
  const currentDay = safeData.day || 10;
  const timePeriod = safeData.period === 'MORNING' ? 'morning' : 'night';
  const publicPath = process.env.PUBLIC_URL;
  const bgImage = `${publicPath}/assets/bg/bg_${timePeriod}.png`;

  const isStudiedToday = lastStudiedDay === currentDay;
  const isTradedToday = lastTradedDay === currentDay;

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

  const handleInteract = (id) => {
    if (id === 'BED') {
      onAction(); 
    } else if (id === 'LAPTOP') {
      // 💡 주식 창을 "열 때는" 행동력을 소모하지 않습니다.
      setIsStockOpen(true); 
    } else if (id === 'PHONE') {
      setIsPhoneOpen(true); 
    } else if (id === 'NEWSPAPER') {
      if (lastReadNewsDay === currentDay) setIsNewsOpen(true);
      else setConfirmConfig({ isOpen: true, type: 'NEWSPAPER', cost: 1, title: '신문', actionText: '확인' }); 
    } else if (id === 'TV') {
      if (lastWatchedTvDay === currentDay) setIsTvOpen(true);
      else setConfirmConfig({ isOpen: true, type: 'TV', cost: 2, title: '티비', actionText: '확인' }); 
    } else if (id === 'DESK') {
      if (!isStudiedToday) {
        setConfirmConfig({ isOpen: true, type: 'DESK', cost: 1, title: '공부', actionText: '진행' });
      }
    }
  };

  const handleConfirmAction = () => {
    console.log(`[API 연동 대기] 행동력 ${confirmConfig.cost} 소모됨!`);

    if (confirmConfig.type === 'NEWSPAPER') {
      setLastReadNewsDay(currentDay);
      setIsNewsOpen(true);
    } else if (confirmConfig.type === 'TV') {
      setLastWatchedTvDay(currentDay);
      setIsTvOpen(true);
    } else if (confirmConfig.type === 'DESK') {
      setLastStudiedDay(currentDay);
      setIsStudyOpen(true);
    } else if (confirmConfig.type === 'LAPTOP') {
      // 💡 [신규] 주식 거래 확정 시 처리
      console.log('최종 주식 거래 데이터 (백엔드 전송용):', pendingTradeData);
      
      // 나중에 이 부분에서 부모 컴포넌트로 pendingTradeData를 올려보내고, 
      // 상태(돈, 주식보유량, 행동력)를 업데이트하는 함수를 호출하시면 됩니다.
      
      setLastTradedDay(currentDay);

      setIsStockOpen(false); // 거래창 닫기
      setPendingTradeData(null); // 임시 데이터 초기화
    }
    
    setConfirmConfig({ isOpen: false, type: '', cost: 0, title: '', actionText: '' }); 
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

        <RoomAssets config={FINAL_ASSET_CONFIG} period={timePeriod} hoveredObject={hoveredObject} onHover={setHoveredObject} onInteract={handleInteract} isStudiedToday={isStudiedToday} />
      </div>

      <BottomPanel data={safeData} hoveredObject={hoveredObject} onHover={setHoveredObject} onInteract={handleInteract} isStudiedToday={isStudiedToday} />

      <EnergyConfirmModal isOpen={confirmConfig.isOpen} config={confirmConfig} onConfirm={handleConfirmAction} onClose={() => setConfirmConfig({ isOpen: false, type: '', cost: 0, title: '', actionText: '' })} />
      <NewsModal isOpen={isNewsOpen} onClose={() => setIsNewsOpen(false)} day={currentDay} />
      <PhoneModal isOpen={isPhoneOpen} onClose={() => setIsPhoneOpen(false)} day={currentDay} />
      <TvModal isOpen={isTvOpen} onClose={() => setIsTvOpen(false)} day={currentDay} />
      <StudyModal isOpen={isStudyOpen} onClose={() => setIsStudyOpen(false)} />

      {/* 💡 [핵심] 변경된 StockModal 적용 */}
      <StockModal 
        isOpen={isStockOpen} 
        onClose={() => setIsStockOpen(false)} 
        day={currentDay}
        money={safeData.money || 250000} // 기본값 셋팅
        holdings={safeData.holdings || { 4: 10, 1: 5 }} // 테스트용 더미 보유주식 (나중엔 실제 데이터 연동)
        onConfirmTrade={(tradeData) => {
          // 💡 거래 확정 버튼을 누르면 데이터를 임시 저장하고 행동력 경고창을 띄웁니다!
          setPendingTradeData(tradeData);
          setConfirmConfig({ isOpen: true, type: 'LAPTOP', cost: 1, title: '투자 진행', actionText: '확정' });
        }}
        isTradedToday={isTradedToday}
      />

    </div>
  );
};

export default GamePlay;