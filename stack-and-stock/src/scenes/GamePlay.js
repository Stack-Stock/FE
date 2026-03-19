import React, { useState, useEffect } from 'react';
import useGameStore from '../store/useGameStore'; // 💡 스토어 임포트
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

// 💡 스토어로 이관된 데이터(Holdings, Logs 등)의 DUMMY 제거 완료
const DUMMY_ARCHIVE_DATA = {
  9: [
    { stock: '네이벼', realDate: '2022.10.15', realTitle: '판교 데이터센터 화재 사태', reason: '투자 심리 위축', impact: 'BAD' }
  ]
};

// 💡 [수정] 불필요한 data 프롭스 제거
const GamePlay = ({ onAction, onGoMain }) => {
  // 💡 스토어에서 게임 상태 직수령
  const { 
    day: currentDay, 
    period, 
    money: currentMoney, 
    sparkCount, 
    studyCount,
    holdings,
    tradeLogs,
    daySummary: settlementData,
    showToast,         
    updateAfterTrade,
    useEnergy // 💡 행동력 차감 액션 (필요시 연결)
  } = useGameStore();

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

  // 💡 [신규] API에서 받아온 각 매체의 실제 텍스트 내용을 저장할 State
  const [phoneContent, setPhoneContent] = useState("");
  const [tvContent, setTvContent] = useState("");
  const [newsContent, setNewsContent] = useState("");

  const timePeriod = period === 'MORNING' ? 'morning' : 'night';
  const publicPath = process.env.PUBLIC_URL;
  const bgImage = `${publicPath}/assets/bg/bg_${timePeriod}.png`;

  const isStudiedToday = lastStudiedDay === currentDay;
  const isTradedToday = lastTradedDay === currentDay;

  // 💡 1일 차가 아니고 스토어에 정산 데이터가 있다면 자동 팝업
  useEffect(() => {
    if (timePeriod === 'morning' && currentDay > 1 && currentDay > lastPopupDay && settlementData) {
      setIsSettlementOpen(true);
      setLastPopupDay(currentDay);
    }
  }, [currentDay, timePeriod, lastPopupDay, settlementData]);

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

// 💡 [핵심] 통합 API 호출 함수 (행동력 차감 + 모달 내용 세팅 + 스토어 업데이트)
  const executeInfoAction = async (actionType) => {
    try {
      const res = await gameApi.executeAction(actionType);
      
      // 스토어의 행동력과 돈 동기화
      useGameStore.setState({ energy: res.apRemaining, money: res.cashBalance });

      if (actionType === 'INFO_PHONE') {
        setPhoneContent(res.message); // 백엔드에서 준 실제 기사 텍스트
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
        // 스토어의 studyCount 증가
        useGameStore.setState(state => ({ studyCount: state.studyCount + 1 }));
        setIsStudyOpen(true);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "행동을 실행할 수 없습니다.";
      alert(errorMsg); // AP 부족이나 이미 공부한 경우 백엔드 에러 띄우기
    }
  };

  const handleInteract = (id) => {
    if (id === 'BED') onAction(); 
    else if (id === 'LAPTOP') setIsStockOpen(true); 
    else if (id === 'PHONE') {
      // 폰은 AP 소모가 없으므로 바로 API 호출 (이미 호출했다면 모달만 띄움)
      if (phoneContent) setIsPhoneOpen(true);
      else executeInfoAction('INFO_PHONE');
    } else if (id === 'NEWSPAPER') {
      if (lastReadNewsDay === currentDay) setIsNewsOpen(true);
      else setConfirmConfig({ isOpen: true, type: 'NEWSPAPER', cost: 2, title: '신문', actionText: '확인' }); 
    } else if (id === 'TV') {
      if (lastWatchedTvDay === currentDay) setIsTvOpen(true);
      else setConfirmConfig({ isOpen: true, type: 'TV', cost: 1, title: '티비', actionText: '확인' }); 
    } else if (id === 'DESK') {
      if (!isStudiedToday) setConfirmConfig({ isOpen: true, type: 'DESK', cost: 1, title: '공부', actionText: '진행' });
    }
  };

  // 💡 모달에서 "확인" 눌렀을 때 API 호출로 변경
  const handleConfirmAction = async () => {
    const type = confirmConfig.type;
    const currentConfig = { ...confirmConfig }; // 클로저 이슈 방지
    setConfirmConfig({ isOpen: false, type: '', cost: 0, title: '', actionText: '' }); 

    try {
      if (type === 'NEWSPAPER') await executeInfoAction('INFO_PAPER');
      else if (type === 'TV') await executeInfoAction('INFO_TV');
      else if (type === 'DESK') await executeInfoAction('STUDY');
      else if (type === 'LAPTOP') {
        // 💡 [투자 확정] 백엔드 호출
        // pendingTradeData에는 { stockId, quantity, side } 가 들어있어야 함
        const res = await gameApi.executeAction(
          pendingTradeData.side, // 'BUY' 또는 'SELL'
          pendingTradeData.stockId,
          pendingTradeData.quantity
        );
        
        // 스토어 업데이트 (돈, 보유주식)
        updateAfterTrade(res.cashBalance, res.holdings);
        setLastTradedDay(currentDay);
        setIsStockOpen(false);
        showToast("거래가 성공적으로 체결되었습니다!", "success");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "작업을 완료할 수 없습니다.";
      showToast(errorMsg, "error"); // 💡 alert 대신 토스트 사용!
    }
  };

  const circleBtnStyle = { width: '45px', height: '45px', borderRadius: '50%', border: '3px solid #000', color: '#fff', fontWeight: 'bold', fontSize: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' };
  const textShadowStyle = { textShadow: '2px 2px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000, 1px 1px 0px #000' };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#000', boxSizing: 'border-box', position: 'relative' }}>
      
      {/* 💡 StatusBar도 이제 스토어를 직접 보게 수정될 예정이라 data를 넘길 필요 없어집니다 (다음 단계) */}
      <StatusBar />

      <div style={{ flex: 1, position: 'relative', backgroundColor: timePeriod === 'morning' ? '#87CEEB' : '#2c3e50', backgroundImage: `url(${bgImage})`, backgroundRepeat: 'no-repeat', backgroundPosition: `${FINAL_BG_X}px ${FINAL_BG_Y}px`, backgroundSize: `${FINAL_BG_SCALE}%`, imageRendering: 'pixelated', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        
        <div style={{ position: 'absolute', top: '20px', left: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', zIndex: 1000 }}>
          <button style={{ width: '55px', height: '55px', backgroundColor: 'transparent', border: 'none', padding: 0, cursor: sparkCount > 0 ? 'pointer' : 'not-allowed', filter: sparkCount > 0 ? 'drop-shadow(2px 2px 0px rgba(0,0,0,0.5))' : 'grayscale(100%) opacity(0.7) drop-shadow(2px 2px 0px rgba(0,0,0,0.5))', transition: 'all 0.2s', transform: sparkCount > 0 ? 'scale(1)' : 'scale(0.95)' }} disabled={sparkCount === 0} onClick={() => { if (sparkCount > 0) console.log('번뜩임 사용'); }}>
            <img src={`${publicPath}/assets/ui/spark_icon.png`} alt="번뜩임" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ color: sparkCount > 0 ? '#FFD700' : '#aaa', fontSize: '14px', fontWeight: 'bold', marginBottom: '1px', ...textShadowStyle }}>번뜩임: {sparkCount}</span>
            <span style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold', ...textShadowStyle }}>공부: {studyCount}/3</span>
          </div>
        </div>

        <div style={{ position: 'absolute', top: '20px', right: '30px', display: 'flex', gap: '15px', zIndex: 1000 }}>
          <button style={{ ...circleBtnStyle, backgroundColor: currentDay === 1 ? '#555' : '#4a90e2', color: currentDay === 1 ? '#999' : '#fff', border: currentDay === 1 ? '3px solid #333' : '3px solid #000', boxShadow: currentDay === 1 ? 'none' : '2px 2px 0px rgba(0,0,0,0.5)', cursor: currentDay === 1 ? 'not-allowed' : 'pointer' }} onClick={() => { if (currentDay > 1) setIsSettlementOpen(true); }} disabled={currentDay === 1}>P</button>
          <button style={{ ...circleBtnStyle, backgroundColor: currentDay === 1 ? '#555' : '#8e44ad', color: currentDay === 1 ? '#999' : '#fff', border: currentDay === 1 ? '3px solid #333' : '3px solid #000', boxShadow: currentDay === 1 ? 'none' : '2px 2px 0px rgba(0,0,0,0.5)', cursor: currentDay === 1 ? 'not-allowed' : 'pointer' }} onClick={() => { if (currentDay > 1) setIsArchiveOpen(true); }} disabled={currentDay === 1}>A</button>
          <button style={{ ...circleBtnStyle, backgroundColor: '#e74c3c', cursor: 'pointer', boxShadow: '2px 2px 0px rgba(0,0,0,0.5)' }} onClick={() => setIsHelpOpen(true)}>?</button>
        </div>

        <RoomAssets config={FINAL_ASSET_CONFIG} period={timePeriod} hoveredObject={hoveredObject} onHover={setHoveredObject} onInteract={handleInteract} isStudiedToday={isStudiedToday} />
      </div>

      <BottomPanel data={{ money: currentMoney, energy: useGameStore.getState().energy, day: currentDay, period }} hoveredObject={hoveredObject} onHover={setHoveredObject} onInteract={handleInteract} isStudiedToday={isStudiedToday} />
      <EnergyConfirmModal isOpen={confirmConfig.isOpen} config={confirmConfig} onConfirm={handleConfirmAction} onClose={() => setConfirmConfig({ isOpen: false, type: '', cost: 0, title: '', actionText: '' })} />
      <NewsModal isOpen={isNewsOpen} onClose={() => setIsNewsOpen(false)} day={currentDay} content={newsContent} />
      <PhoneModal isOpen={isPhoneOpen} onClose={() => setIsPhoneOpen(false)} day={currentDay} content={phoneContent} />
      <TvModal isOpen={isTvOpen} onClose={() => setIsTvOpen(false)} day={currentDay} content={tvContent} />
      <StudyModal isOpen={isStudyOpen} onClose={() => setIsStudyOpen(false)} />

      {/* 💡 모달들도 추후 스토어 구독으로 바꾸면 프롭스 지옥에서 탈출합니다 */}
      <StockModal isOpen={isStockOpen} onClose={() => setIsStockOpen(false)} day={currentDay} money={currentMoney} holdings={holdings} isTradedToday={isTradedToday} onConfirmTrade={(tradeData) => { setPendingTradeData(tradeData); setConfirmConfig({ isOpen: true, type: 'LAPTOP', cost: 1, title: '투자 진행', actionText: '확정' }); }} />
      <SettlementModal isOpen={isSettlementOpen} onClose={() => setIsSettlementOpen(false)} day={currentDay} settlementData={settlementData} currentMoney={currentMoney} holdings={holdings} tradeLogs={tradeLogs} />
      <ArchiveModal isOpen={isArchiveOpen} onClose={() => setIsArchiveOpen(false)} currentDay={currentDay} archiveData={DUMMY_ARCHIVE_DATA} />
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

    </div>
  );
};

export default GamePlay;