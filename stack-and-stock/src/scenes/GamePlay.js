import React, { useState, useEffect } from 'react';
import useGameStore from '../store/useGameStore';
import { gameApi } from '../api/gameApi';
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

const DUMMY_ARCHIVE_DATA = {
  9: [{ stock: '네이벼', realDate: '2022.10.15', realTitle: '판교 데이터센터 화재 사태', reason: '투자 심리 위축', impact: 'BAD' }]
};

const FINAL_ASSET_CONFIG = {
  WINDOW: { x: 480, y: 40, w: 230, h: 150, scale: 155 },
  TV: { x: 240, y: 160, w: 140, h: 100, scale: 240 },
  BED: { x: 743, y: 206, w: 206, h: 141, scale: 293 },
  DESK: { x: -270, y: 340, w: 900, h: 225, scale: 143 },
  NEWSPAPER: { x: 468, y: 361, w: 83, h: 45, scale: 191 },
  PHONE: { x: 192, y: 353, w: 330, h: 374, scale: 26 },
  LAPTOP: { x: 277, y: 278, w: 75, h: 62, scale: 272 },
};

const GamePlay = ({ onAction, onGoMain }) => {
  const { 
    runId, day: currentDay, period, money: currentMoney, 
    energy,
    sparkCount, studyCount, holdings, tradeLogs, 
    daySummary: settlementData, showToast, updateAfterTrade, 
    availableStocks
  } = useGameStore();

  useEffect(() => {
    console.log(`📊 [DAY ${currentDay}] 현재 스토어에 저장된 주식 데이터:`, availableStocks);
  }, [availableStocks, currentDay]);

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

  const [phoneContent, setPhoneContent] = useState("");
  const [tvContent, setTvContent] = useState("");
  const [newsContent, setNewsContent] = useState("");

  const timePeriod = period === 'MORNING' ? 'morning' : 'night';
  const publicPath = process.env.PUBLIC_URL;
  const bgImage = `${publicPath}/assets/bg/bg_${timePeriod}.png`;

  const isTvWatchedToday = lastWatchedTvDay === currentDay;
  const isStudiedToday = lastStudiedDay === currentDay;
  const isTradedToday = lastTradedDay === currentDay;

  useEffect(() => {
    setPhoneContent("");
    setTvContent("");
    setNewsContent("");
  }, [currentDay]);

  useEffect(() => {
    if (timePeriod === 'morning' && currentDay > 1 && currentDay > lastPopupDay && settlementData) {
      setIsSettlementOpen(true);
      setLastPopupDay(currentDay);
    }
  }, [currentDay, timePeriod, lastPopupDay, settlementData]);

  const executeInfoAction = async (actionType) => {
    try {
      const res = await gameApi.executeAction(actionType);
      useGameStore.setState({ energy: res.apRemaining, money: res.cashBalance });

      if (actionType === 'INFO_PHONE') {
        setPhoneContent(res.message);
        setIsPhoneOpen(true);
      } else if (actionType === 'INFO_TV') {
        setTvContent(res.message);
        setLastWatchedTvDay(currentDay); 
        setIsTvOpen(true);
      } else if (actionType === 'INFO_PAPER') {
        setNewsContent(res.message);
        setLastReadNewsDay(currentDay);
        setIsNewsOpen(true);
      } else if (actionType === 'STUDY') {
        setLastStudiedDay(currentDay);
        useGameStore.setState(state => ({ studyCount: state.studyCount + 1 }));
        setIsStudyOpen(true);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "행동을 실행할 수 없습니다.";
      showToast(errorMsg, "error");
    }
  };

  const handleInteract = (id) => {
    if (id === 'BED') onAction(); 
    else if (id === 'LAPTOP') setIsStockOpen(true); 
    else if (id === 'PHONE') {
      if (phoneContent) setIsPhoneOpen(true);
      else executeInfoAction('INFO_PHONE');
    } else if (id === 'TV') {
      if (isTvWatchedToday) {
        showToast("뉴스는 이미 종료되었습니다. (1일 1회 시청 가능)", "info");
      } else {
        setConfirmConfig({ isOpen: true, type: 'TV', cost: 1, title: '티비', actionText: '확인' }); 
      }
    } else if (id === 'NEWSPAPER') {
      if (lastReadNewsDay === currentDay) {
        setIsNewsOpen(true);
        showToast("신문은 이미 다 읽었습니다.", "info");
      } else {
        setConfirmConfig({ isOpen: true, type: 'NEWSPAPER', cost: 2, title: '신문', actionText: '확인' }); 
      }
    } else if (id === 'DESK') {
      if (isStudiedToday) {
        showToast("이미 오늘의 공부를 마쳤습니다!", "info");
      } else {
        setConfirmConfig({ isOpen: true, type: 'DESK', cost: 1, title: '공부', actionText: '진행' });
      }
    }
  };

  const handleConfirmAction = async () => {
    const type = confirmConfig.type;
    const cost = confirmConfig.cost;

    setConfirmConfig({ isOpen: false, type: '', cost: 0, title: '', actionText: '' }); 

    if (energy < cost) {
      showToast("사용할 수 있는 행동력이 없습니다.", "error");
      return; 
    }

    try {
      if (type === 'NEWSPAPER') await executeInfoAction('INFO_PAPER');
      else if (type === 'TV') await executeInfoAction('INFO_TV');
      else if (type === 'DESK') await executeInfoAction('STUDY');
      else if (type === 'LAPTOP') {
        
        // 💡 [핵심] 모달에서 넘겨준 거래 데이터로 백엔드 API 실행
        if (pendingTradeData && pendingTradeData.orders && pendingTradeData.orders.length > 0) {
           await gameApi.executeTrade(pendingTradeData);
           
           // 거래 성공 후 포트폴리오 API를 다시 호출하여 스토어 동기화
           const newPortfolio = await gameApi.getCurrentPortfolio();
           
           // 💡 [핵심 수정] 투자 성공 시 행동력(energy)도 차감하도록 추가!
           useGameStore.setState((state) => ({ 
             money: newPortfolio.cashBalance, 
             holdings: newPortfolio.holdings,
             energy: state.energy - cost 
           }));

           setLastTradedDay(currentDay);
           showToast("주식 거래가 성공적으로 체결되었습니다!", "success");
        } else {
           // 주문 내역이 없으면 행동력을 깎지 않음
           showToast("선택된 거래 내역이 없습니다.", "info");
        }
        setIsStockOpen(false);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "거래를 완료할 수 없습니다.";
      showToast(errorMsg, "error");
    }
  };

  const FINAL_BG_X = 0, FINAL_BG_Y = -65, FINAL_BG_SCALE = 100; 

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#000', boxSizing: 'border-box', position: 'relative' }}>
      <StatusBar />
      <div style={{ flex: 1, position: 'relative', backgroundColor: timePeriod === 'morning' ? '#87CEEB' : '#2c3e50', backgroundImage: `url(${bgImage})`, backgroundRepeat: 'no-repeat', backgroundPosition: `${FINAL_BG_X}px ${FINAL_BG_Y}px`, backgroundSize: `${FINAL_BG_SCALE}%`, imageRendering: 'pixelated', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        
        <div style={{ position: 'absolute', top: '20px', left: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', zIndex: 1000 }}>
          <button style={{ width: '55px', height: '55px', backgroundColor: 'transparent', border: 'none', padding: 0, cursor: sparkCount > 0 ? 'pointer' : 'not-allowed', filter: sparkCount > 0 ? 'drop-shadow(2px 2px 0px rgba(0,0,0,0.5))' : 'grayscale(100%) opacity(0.7) drop-shadow(2px 2px 0px rgba(0,0,0,0.5))', transition: 'all 0.2s', transform: sparkCount > 0 ? 'scale(1)' : 'scale(0.95)' }} disabled={sparkCount === 0} onClick={() => { if (sparkCount > 0) showToast("번뜩임을 사용합니다!", "success"); }}>
            <img src={`${publicPath}/assets/ui/spark_icon.png`} alt="번뜩임" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ color: sparkCount > 0 ? '#FFD700' : '#aaa', fontSize: '14px', fontWeight: 'bold', marginBottom: '1px', textShadow: '2px 2px 0px #000' }}>번뜩임: {sparkCount}</span>
            <span style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold', textShadow: '2px 2px 0px #000' }}>공부: {studyCount}/3</span>
          </div>
        </div>

        <div style={{ position: 'absolute', top: '20px', right: '30px', display: 'flex', gap: '15px', zIndex: 1000 }}>
          <button style={{ width: '45px', height: '45px', borderRadius: '50%', border: '3px solid #000', color: '#fff', fontWeight: 'bold', fontSize: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: currentDay === 1 ? '#555' : '#4a90e2', cursor: currentDay === 1 ? 'not-allowed' : 'pointer' }} onClick={() => { if (currentDay > 1) setIsSettlementOpen(true); }} disabled={currentDay === 1}>P</button>
          <button style={{ width: '45px', height: '45px', borderRadius: '50%', border: '3px solid #000', color: '#fff', fontWeight: 'bold', fontSize: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: currentDay === 1 ? '#555' : '#8e44ad', cursor: currentDay === 1 ? 'not-allowed' : 'pointer' }} onClick={() => { if (currentDay > 1) setIsArchiveOpen(true); }} disabled={currentDay === 1}>A</button>
          <button style={{ width: '45px', height: '45px', borderRadius: '50%', border: '3px solid #000', color: '#fff', fontWeight: 'bold', fontSize: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#e74c3c', cursor: currentDay === 1 ? 'not-allowed' : 'pointer' }} onClick={() => setIsHelpOpen(true)}>?</button>
        </div>

        <RoomAssets config={FINAL_ASSET_CONFIG} period={timePeriod} hoveredObject={hoveredObject} onHover={setHoveredObject} onInteract={handleInteract} isStudiedToday={isStudiedToday} />
      </div>

      <BottomPanel 
        data={{ money: currentMoney, day: currentDay, period }} 
        hoveredObject={hoveredObject} 
        onHover={setHoveredObject} 
        onInteract={handleInteract} 
        isStudiedToday={isStudiedToday}
        isTvWatchedToday={isTvWatchedToday} 
      />
      
      <EnergyConfirmModal isOpen={confirmConfig.isOpen} config={confirmConfig} onConfirm={handleConfirmAction} onClose={() => setConfirmConfig({ isOpen: false, type: '', cost: 0, title: '', actionText: '' })} />
      <NewsModal isOpen={isNewsOpen} onClose={() => setIsNewsOpen(false)} day={currentDay} content={newsContent} />
      <PhoneModal isOpen={isPhoneOpen} onClose={() => setIsPhoneOpen(false)} day={currentDay} content={phoneContent} />
      <TvModal isOpen={isTvOpen} onClose={() => setIsTvOpen(false)} day={currentDay} content={tvContent} />
      <StudyModal isOpen={isStudyOpen} onClose={() => setIsStudyOpen(false)} />
      
      {/* 💡 거래 내역(데이터)을 담아서 GamePlay로 올리는 StockModal */}
      <StockModal 
        isOpen={isStockOpen} 
        onClose={() => setIsStockOpen(false)} 
        onConfirmTrade={(data) => { 
          setPendingTradeData(data); // 장바구니 내역 저장
          setConfirmConfig({ isOpen: true, type: 'LAPTOP', cost: 1, title: '투자 진행', actionText: '확정' }); 
        }} 
        isTradedToday={isTradedToday} 
      />
      
      <SettlementModal isOpen={isSettlementOpen} onClose={() => setIsSettlementOpen(false)} day={currentDay} settlementData={settlementData} currentMoney={currentMoney} holdings={holdings} tradeLogs={tradeLogs} />
      <ArchiveModal isOpen={isArchiveOpen} onClose={() => setIsArchiveOpen(false)} currentDay={currentDay} archiveData={DUMMY_ARCHIVE_DATA} />
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};

export default GamePlay;