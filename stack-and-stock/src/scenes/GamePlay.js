import React, { useState, useEffect } from 'react';
import StatusBar from '../components/StatusBar';
import BottomPanel from '../components/BottomPanel';
import StockModal from '../components/StockModal';
import NewsModal from '../components/NewsModal';
import PhoneModal from '../components/PhoneModal';
import TvModal from '../components/TvModal';
import EnergyConfirmModal from '../components/EnergyConfirmModal';
import StudyModal from '../components/StudyModal';
import RoomAssets from '../components/RoomAssets'; 
import SettlementModal from '../components/SettlementModal'; 
import ArchiveModal from '../components/ArchiveModal'; 
import HelpModal from '../components/HelpModal';

// 💡 [수정] Holdings 더미 데이터를 백엔드 DTO(PortfolioStockResponse) 배열 형태로 변경!
const DUMMY_HOLDINGS = [
  { stockId: 1, quantity: 5, avgCost: 190000, companyName: "네이벼", ticker: "NAVER" },
  { stockId: 4, quantity: 10, avgCost: 70000, companyName: "삼송전자", ticker: "SAMSUNG" }
];
const DUMMY_SETTLEMENT = { totalChange: 15281, cashChange: 0, stockChange: 15281 };
const DUMMY_TRADE_LOGS = [
  { tradeId: 1, dayNo: 2, stockId: 4, company: '삼송전자', quantity: 10, price: 70000, tradeType: 'BUY' },
  { tradeId: 2, dayNo: 5, stockId: 1, company: '네이벼', quantity: 5, price: 190000, tradeType: 'BUY' },
  { tradeId: 3, dayNo: 9, stockId: 4, company: '삼송전자', quantity: 2, price: 75000, tradeType: 'SELL' },
];
const DUMMY_ARCHIVE_DATA = {
  9: [
    { stock: '네이벼', realDate: '2022.10.15', realTitle: '판교 데이터센터 화재 사태', reason: '투자 심리 위축', impact: 'BAD' }
  ]
};

const DUMMY_SPARK_DATA = { sparkCount: 0, studyCount: 2 };

const GamePlay = ({ data, onAction, onGoMain }) => {
  const [hoveredObject, setHoveredObject] = useState(null);
  const [isStockOpen, setIsStockOpen] = useState(false);
  const [isNewsOpen, setIsNewsOpen] = useState(false);
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const [isTvOpen, setIsTvOpen] = useState(false);
  const [isStudyOpen, setIsStudyOpen] = useState(false); 
  const [isSettlementOpen, setIsSettlementOpen] = useState(false); 
  const [isArchiveOpen, setIsArchiveOpen] = useState(false); 
  const [lastPopupDay, setLastPopupDay] = useState(1); 
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, type: '', cost: 0, title: '', actionText: '' });
  
  const [lastReadNewsDay, setLastReadNewsDay] = useState(0);
  const [lastWatchedTvDay, setLastWatchedTvDay] = useState(0);
  const [lastStudiedDay, setLastStudiedDay] = useState(0); 
  const [lastTradedDay, setLastTradedDay] = useState(0);
  const [pendingTradeData, setPendingTradeData] = useState(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const safeData = data || {};
  const currentDay = safeData.day || 10;
  const timePeriod = safeData.period === 'MORNING' ? 'morning' : 'night';
  const publicPath = process.env.PUBLIC_URL;
  const bgImage = `${publicPath}/assets/bg/bg_${timePeriod}.png`;

  const isStudiedToday = lastStudiedDay === currentDay;
  const isTradedToday = lastTradedDay === currentDay;

  // 💡 데이터가 빈 배열이면 게임 시작 시 에러가 나지 않고 빈 화면이 잘 나옵니다!
  const currentMoney = safeData.money !== undefined ? safeData.money : 250000;
  const settlementData = safeData.settlement || DUMMY_SETTLEMENT;
  const holdingsData = safeData.holdings && safeData.holdings.length >= 0 ? safeData.holdings : DUMMY_HOLDINGS;
  const tradeLogsData = safeData.tradeLogs && safeData.tradeLogs.length >= 0 ? safeData.tradeLogs : DUMMY_TRADE_LOGS;
  const archiveData = safeData.archive || DUMMY_ARCHIVE_DATA;
  const sparkData = safeData.spark || DUMMY_SPARK_DATA;

  useEffect(() => {
    if (timePeriod === 'morning' && currentDay > 1 && currentDay > lastPopupDay) {
      setIsSettlementOpen(true);
      setLastPopupDay(currentDay);
    }
  }, [currentDay, timePeriod, lastPopupDay]);

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
    if (id === 'BED') onAction(); 
    else if (id === 'LAPTOP') setIsStockOpen(true); 
    else if (id === 'PHONE') setIsPhoneOpen(true); 
    else if (id === 'NEWSPAPER') {
      if (lastReadNewsDay === currentDay) setIsNewsOpen(true);
      else setConfirmConfig({ isOpen: true, type: 'NEWSPAPER', cost: 2, title: '신문', actionText: '확인' }); 
    } else if (id === 'TV') {
      if (lastWatchedTvDay === currentDay) setIsTvOpen(true);
      else setConfirmConfig({ isOpen: true, type: 'TV', cost: 1, title: '티비', actionText: '확인' }); 
    } else if (id === 'DESK') {
      if (!isStudiedToday) setConfirmConfig({ isOpen: true, type: 'DESK', cost: 1, title: '공부', actionText: '진행' });
    }
  };

  const handleConfirmAction = () => {
    if (confirmConfig.type === 'NEWSPAPER') { setLastReadNewsDay(currentDay); setIsNewsOpen(true); } 
    else if (confirmConfig.type === 'TV') { setLastWatchedTvDay(currentDay); setIsTvOpen(true); } 
    else if (confirmConfig.type === 'DESK') { setLastStudiedDay(currentDay); setIsStudyOpen(true); } 
    else if (confirmConfig.type === 'LAPTOP') {
      setLastTradedDay(currentDay);
      setIsStockOpen(false); 
      setPendingTradeData(null); 
    }
    setConfirmConfig({ isOpen: false, type: '', cost: 0, title: '', actionText: '' }); 
  };

  const circleBtnStyle = { width: '45px', height: '45px', borderRadius: '50%', border: '3px solid #000', color: '#fff', fontWeight: 'bold', fontSize: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' };
  const textShadowStyle = { textShadow: '2px 2px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000, 1px 1px 0px #000' };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#000', boxSizing: 'border-box', position: 'relative' }}>
      <StatusBar data={{...safeData, money: currentMoney}} />

      <div style={{ flex: 1, position: 'relative', backgroundColor: timePeriod === 'morning' ? '#87CEEB' : '#2c3e50', backgroundImage: `url(${bgImage})`, backgroundRepeat: 'no-repeat', backgroundPosition: `${FINAL_BG_X}px ${FINAL_BG_Y}px`, backgroundSize: `${FINAL_BG_SCALE}%`, imageRendering: 'pixelated', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        
        <div style={{ position: 'absolute', top: '20px', left: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', zIndex: 1000 }}>
          <button style={{ width: '55px', height: '55px', backgroundColor: 'transparent', border: 'none', padding: 0, cursor: sparkData.sparkCount > 0 ? 'pointer' : 'not-allowed', filter: sparkData.sparkCount > 0 ? 'drop-shadow(2px 2px 0px rgba(0,0,0,0.5))' : 'grayscale(100%) opacity(0.7) drop-shadow(2px 2px 0px rgba(0,0,0,0.5))', transition: 'all 0.2s', transform: sparkData.sparkCount > 0 ? 'scale(1)' : 'scale(0.95)' }} disabled={sparkData.sparkCount === 0} onClick={() => { if (sparkData.sparkCount > 0) console.log('번뜩임 사용'); }}>
            <img src={`${publicPath}/assets/ui/spark_icon.png`} alt="번뜩임" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ color: sparkData.sparkCount > 0 ? '#FFD700' : '#aaa', fontSize: '14px', fontWeight: 'bold', marginBottom: '1px', ...textShadowStyle }}>번뜩임: {sparkData.sparkCount}</span>
            <span style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold', ...textShadowStyle }}>공부: {sparkData.studyCount}/3</span>
          </div>
        </div>

        <div style={{ position: 'absolute', top: '20px', right: '30px', display: 'flex', gap: '15px', zIndex: 1000 }}>
          <button style={{ ...circleBtnStyle, backgroundColor: currentDay === 1 ? '#555' : '#4a90e2', color: currentDay === 1 ? '#999' : '#fff', border: currentDay === 1 ? '3px solid #333' : '3px solid #000', boxShadow: currentDay === 1 ? 'none' : '2px 2px 0px rgba(0,0,0,0.5)', cursor: currentDay === 1 ? 'not-allowed' : 'pointer' }} onClick={() => { if (currentDay > 1) setIsSettlementOpen(true); }} disabled={currentDay === 1}>P</button>
          <button style={{ ...circleBtnStyle, backgroundColor: currentDay === 1 ? '#555' : '#8e44ad', color: currentDay === 1 ? '#999' : '#fff', border: currentDay === 1 ? '3px solid #333' : '3px solid #000', boxShadow: currentDay === 1 ? 'none' : '2px 2px 0px rgba(0,0,0,0.5)', cursor: currentDay === 1 ? 'not-allowed' : 'pointer' }} onClick={() => { if (currentDay > 1) setIsArchiveOpen(true); }} disabled={currentDay === 1}>A</button>
          <button style={{ ...circleBtnStyle, backgroundColor: '#e74c3c', cursor: 'pointer', boxShadow: '2px 2px 0px rgba(0,0,0,0.5)' }} onClick={() => setIsHelpOpen(true)}>?</button>
        </div>

        <RoomAssets config={FINAL_ASSET_CONFIG} period={timePeriod} hoveredObject={hoveredObject} onHover={setHoveredObject} onInteract={handleInteract} isStudiedToday={isStudiedToday} />
      </div>

      <BottomPanel data={safeData} hoveredObject={hoveredObject} onHover={setHoveredObject} onInteract={handleInteract} isStudiedToday={isStudiedToday} />
      <EnergyConfirmModal isOpen={confirmConfig.isOpen} config={confirmConfig} onConfirm={handleConfirmAction} onClose={() => setConfirmConfig({ isOpen: false, type: '', cost: 0, title: '', actionText: '' })} />
      <NewsModal isOpen={isNewsOpen} onClose={() => setIsNewsOpen(false)} day={currentDay} />
      <PhoneModal isOpen={isPhoneOpen} onClose={() => setIsPhoneOpen(false)} day={currentDay} />
      <TvModal isOpen={isTvOpen} onClose={() => setIsTvOpen(false)} day={currentDay} />
      <StudyModal isOpen={isStudyOpen} onClose={() => setIsStudyOpen(false)} />

      <StockModal isOpen={isStockOpen} onClose={() => setIsStockOpen(false)} day={currentDay} money={currentMoney} holdings={holdingsData} isTradedToday={isTradedToday} onConfirmTrade={(tradeData) => { setPendingTradeData(tradeData); setConfirmConfig({ isOpen: true, type: 'LAPTOP', cost: 1, title: '투자 진행', actionText: '확정' }); }} />
      <SettlementModal isOpen={isSettlementOpen} onClose={() => setIsSettlementOpen(false)} day={currentDay} settlementData={settlementData} currentMoney={currentMoney} holdings={holdingsData} tradeLogs={tradeLogsData} />
      <ArchiveModal isOpen={isArchiveOpen} onClose={() => setIsArchiveOpen(false)} currentDay={currentDay} archiveData={archiveData} />
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

    </div>
  );
};

export default GamePlay;