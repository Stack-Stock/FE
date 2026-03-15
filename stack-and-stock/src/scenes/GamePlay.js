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

// 💡 [API 연동 대비 포인트] 
// 나중에 백엔드 API가 연결되면 이 더미 상수들을 지우거나 안 쓰시면 됩니다.
// 백엔드에서 받아온 값을 부모(App.js)가 data={...} 프롭스로 내려주면 자동으로 교체됩니다.
const DUMMY_SETTLEMENT = { totalChange: 15281, cashChange: 0, stockChange: 15281 };
const DUMMY_HOLDINGS = { 
  1: { quantity: 5, avgPrice: 190000 }, 
  4: { quantity: 10, avgPrice: 70000 } 
};
const DUMMY_TRADE_LOGS = [
  { id: 1, day: 2, stockId: 4, stockName: '삼송전자', quantity: 10, price: 70000, type: 'BUY' },
  { id: 2, day: 5, stockId: 1, stockName: '네이벼', quantity: 5, price: 190000, type: 'BUY' },
  { id: 3, day: 9, stockId: 4, stockName: '삼송전자', quantity: 2, price: 75000, type: 'SELL' },
];
const DUMMY_ARCHIVE_DATA = {
  9: [
    { stock: '네이벼', realDate: '2022.10.15', realTitle: '판교 데이터센터 화재로 서비스 먹통 사태 발생', reason: '카카오와 네이버 등 주요 IT 서비스가 마비되며 플랫폼 신뢰도가 급락, 투자 심리가 크게 위축되었습니다.', impact: 'BAD' },
    { stock: '삼송전자', realDate: '2023.01.06', realTitle: '삼성전자 4분기 어닝 쇼크... 영업이익 69% 급감', reason: '글로벌 경기 침체로 인한 반도체 수요 감소가 실적에 반영되며 주가가 크게 하락했습니다.', impact: 'BAD' }
  ],
  8: [
    { stock: '에코프로(짭)', realDate: '2023.07.26', realTitle: '2차전지 광풍... 에코프로 장중 150만원 돌파', reason: '개인 투자자들의 매수세가 몰리며 2차전지 관련주가 비정상적인 폭등을 기록했습니다.', impact: 'GOOD' }
  ]
};

// 💡 [신규] 번뜩임 더미 데이터 (외부 파일 대신 임시로 상단에 선언)
const DUMMY_SPARK_DATA = {
  sparkCount: 0, // 현재 보유한 번뜩임 개수 (0이면 버튼이 회색으로 비활성화됨)
  studyCount: 2  // 현재 공부 진행 횟수 (최대 3)
};

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

  // 💡 [API 연동 적용] 실제 데이터가 있으면 (백엔드 응답) 그것을 쓰고, 없으면 컴포넌트 바깥에 정의한 DUMMY를 씁니다.
  const currentMoney = safeData.money || 250000;
  const settlementData = safeData.settlement || DUMMY_SETTLEMENT;
  const holdingsData = safeData.holdings || DUMMY_HOLDINGS;
  const tradeLogsData = safeData.tradeLogs || DUMMY_TRADE_LOGS;
  const archiveData = safeData.archive || DUMMY_ARCHIVE_DATA;
  const sparkData = safeData.spark || DUMMY_SPARK_DATA; // 💡 번뜩임 데이터 연결

  useEffect(() => {
    // 2일차 이상 아침에만 정산 팝업 오픈
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
    if (id === 'BED') {
      onAction(); 
    } else if (id === 'LAPTOP') {
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
      console.log('서버로 전송할 거래 확정 데이터:', pendingTradeData);
      setLastTradedDay(currentDay);
      setIsStockOpen(false); 
      setPendingTradeData(null); 
    }
    
    setConfirmConfig({ isOpen: false, type: '', cost: 0, title: '', actionText: '' }); 
  };

  const circleBtnStyle = {
    width: '45px', height: '45px', borderRadius: '50%', border: '3px solid #000', color: '#fff', 
    fontWeight: 'bold', fontSize: '20px', display: 'flex', justifyContent: 'center', 
    alignItems: 'center'
  };

  const textShadowStyle = {
    textShadow: '2px 2px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000, 1px 1px 0px #000'
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#000', boxSizing: 'border-box', position: 'relative' }}>
      <StatusBar data={{...safeData, money: currentMoney}} />

      <div style={{ 
        flex: 1, position: 'relative', backgroundColor: timePeriod === 'morning' ? '#87CEEB' : '#2c3e50',
        backgroundImage: `url(${bgImage})`, backgroundRepeat: 'no-repeat', backgroundPosition: `${FINAL_BG_X}px ${FINAL_BG_Y}px`, 
        backgroundSize: `${FINAL_BG_SCALE}%`, imageRendering: 'pixelated', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden'
      }}>
        
        {/* 💡 [신규 누락 복구] 좌측 상단 번뜩임 UI */}
        <div style={{ position: 'absolute', top: '20px', left: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 1000 }}>
          {/* 번뜩임 버튼 (개수가 0이면 회색조 & 클릭 불가) */}
          <button 
            style={{
              width: '55px', height: '55px', backgroundColor: 'transparent', border: 'none', padding: 0,
              cursor: sparkData.sparkCount > 0 ? 'pointer' : 'not-allowed',
              filter: sparkData.sparkCount > 0 ? 'drop-shadow(2px 2px 0px rgba(0,0,0,0.5))' : 'grayscale(100%) opacity(0.7) drop-shadow(2px 2px 0px rgba(0,0,0,0.5))',
              transition: 'all 0.2s',
              transform: sparkData.sparkCount > 0 ? 'scale(1)' : 'scale(0.95)' // 비활성화 시 살짝 작게
            }}
            disabled={sparkData.sparkCount === 0}
            onClick={() => {
              if (sparkData.sparkCount > 0) {
                console.log('💡 [API 전송 대기] 번뜩임 사용! 행동력 +1 요청');
              }
            }}
          >
            <img src={`${publicPath}/assets/ui/spark_icon.png`} alt="번뜩임" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </button>

          {/* 번뜩임 정보 텍스트 박스 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ 
              color: sparkData.sparkCount > 0 ? '#FFD700' : '#aaa', // 비활성화시 글씨색 더 흐리게
              fontSize: '14px', fontWeight: 'bold', marginBottom: '1px',
              ...textShadowStyle // 그림자 적용
            }}>
              번뜩임: {sparkData.sparkCount}
            </span>
            <span style={{ 
              color: '#fff', // 기본 글씨색 흰색으로 변경
              fontSize: '12px',
              fontWeight: 'bold',
              ...textShadowStyle // 그림자 적용
            }}>
              공부: {sparkData.studyCount}/3
            </span>
          </div>
        </div>

        <div style={{ position: 'absolute', top: '20px', right: '30px', display: 'flex', gap: '15px', zIndex: 1000 }}>
          {/* 정산 (P) 버튼 - 1일차 비활성화 */}
          <button 
            style={{ 
              ...circleBtnStyle, 
              backgroundColor: currentDay === 1 ? '#555' : '#4a90e2', 
              color: currentDay === 1 ? '#999' : '#fff',
              border: currentDay === 1 ? '3px solid #333' : '3px solid #000',
              boxShadow: currentDay === 1 ? 'none' : '2px 2px 0px rgba(0,0,0,0.5)',
              cursor: currentDay === 1 ? 'not-allowed' : 'pointer'
            }} 
            onClick={() => { if (currentDay > 1) setIsSettlementOpen(true); }}
            disabled={currentDay === 1}
          >
            P
          </button>
          
          {/* 기사 아카이브 (A) 버튼 - 1일차 비활성화 */}
          <button 
            style={{ 
              ...circleBtnStyle, 
              backgroundColor: currentDay === 1 ? '#555' : '#8e44ad', 
              color: currentDay === 1 ? '#999' : '#fff',
              border: currentDay === 1 ? '3px solid #333' : '3px solid #000',
              boxShadow: currentDay === 1 ? 'none' : '2px 2px 0px rgba(0,0,0,0.5)',
              cursor: currentDay === 1 ? 'not-allowed' : 'pointer'
            }} 
            onClick={() => { if (currentDay > 1) setIsArchiveOpen(true); }}
            disabled={currentDay === 1}
          >
            A
          </button>

          {/* 튜토리얼 (?) 버튼 */}
          <button 
            style={{ ...circleBtnStyle, backgroundColor: '#e74c3c', cursor: 'pointer', boxShadow: '2px 2px 0px rgba(0,0,0,0.5)' }} 
            onClick={() => setIsHelpOpen(true)}
          >
            ?
          </button>
        </div>

        <RoomAssets config={FINAL_ASSET_CONFIG} period={timePeriod} hoveredObject={hoveredObject} onHover={setHoveredObject} onInteract={handleInteract} isStudiedToday={isStudiedToday} />
      </div>

      <BottomPanel data={safeData} hoveredObject={hoveredObject} onHover={setHoveredObject} onInteract={handleInteract} isStudiedToday={isStudiedToday} />

      <EnergyConfirmModal isOpen={confirmConfig.isOpen} config={confirmConfig} onConfirm={handleConfirmAction} onClose={() => setConfirmConfig({ isOpen: false, type: '', cost: 0, title: '', actionText: '' })} />
      <NewsModal isOpen={isNewsOpen} onClose={() => setIsNewsOpen(false)} day={currentDay} />
      <PhoneModal isOpen={isPhoneOpen} onClose={() => setIsPhoneOpen(false)} day={currentDay} />
      <TvModal isOpen={isTvOpen} onClose={() => setIsTvOpen(false)} day={currentDay} />
      <StudyModal isOpen={isStudyOpen} onClose={() => setIsStudyOpen(false)} />

      {/* 주식 거래 모달 */}
      <StockModal 
        isOpen={isStockOpen} 
        onClose={() => setIsStockOpen(false)} 
        day={currentDay}
        money={currentMoney} 
        holdings={holdingsData} 
        onConfirmTrade={(tradeData) => {
          setPendingTradeData(tradeData);
          setConfirmConfig({ isOpen: true, type: 'LAPTOP', cost: 1, title: '투자 진행', actionText: '확정' });
        }}
        isTradedToday={isTradedToday}
      />

      {/* 포트폴리오(정산) 모달 */}
      <SettlementModal 
        isOpen={isSettlementOpen} 
        onClose={() => setIsSettlementOpen(false)} 
        day={currentDay} 
        settlementData={settlementData}
        currentMoney={currentMoney}
        holdings={holdingsData}
        tradeLogs={tradeLogsData}
      />

      {/* 아카이브 모달 */}
      <ArchiveModal 
        isOpen={isArchiveOpen}
        onClose={() => setIsArchiveOpen(false)}
        currentDay={currentDay}
        archiveData={archiveData}
      />

      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
      />

    </div>
  );
};

export default GamePlay;