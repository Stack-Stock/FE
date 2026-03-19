import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import EventChoice from './EventChoice';
import EventResult from './EventResult';

// 💡 [신규] API 및 스토어 가져오기
import { gameApi } from '../api/gameApi';
import useGameStore from '../store/useGameStore';

// 파편 컴포넌트
const RainbowGlareParticle = ({ angle, isBuildup }) => {
  const colors = ['#e74c3c', '#ffa502', '#eccc68', '#2ed573', '#1e90ff', '#9c88ff', '#ffffff'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const baseLength = isBuildup ? 800 : 400; 
  const length = Math.random() * 300 + baseLength; 
  const duration = isBuildup ? 0.2 + Math.random() * 0.15 : 0.8 + Math.random() * 0.6;

  return (
    <motion.div
      initial={{ width: 0, opacity: 1 }} animate={{ width: `${length}px`, opacity: 0 }}
      transition={{ duration, repeat: Infinity, ease: 'easeOut' }}
      style={{ position: 'absolute', top: 0, left: 0, height: isBuildup ? '10px' : '6px', backgroundColor: color, borderRadius: '5px', filter: 'blur(3px) brightness(1.5)', boxShadow: `0 0 15px ${color}`, transform: `translate(0%, -50%) rotate(${angle}deg)`, transformOrigin: '0% 50%', zIndex: 55 }}
    />
  );
};

// 폭죽 컴포넌트
const Confetti = () => {
  const colors = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6', '#ffffff'];
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden', zIndex: 9999 }}>
      {Array.from({ length: 80 }).map((_, i) => (
        <motion.div key={i} initial={{ y: -50, left: `${Math.random() * 100}%`, rotate: Math.random() * 360, scale: Math.random() * 0.6 + 0.4 }} animate={{ y: '120vh', left: `${Math.random() * 100}%`, rotate: Math.random() * 720 }} transition={{ duration: Math.random() * 2 + 1.5, repeat: Infinity, ease: 'linear', delay: Math.random() * 0.5 }} style={{ position: 'absolute', width: '12px', height: '12px', backgroundColor: colors[Math.floor(Math.random() * colors.length)], clipPath: Math.random() > 0.5 ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' : 'none' }} />
      ))}
    </div>
  );
};

const EventScene = ({ eventType, onComplete }) => {
  const [stage, setStage] = useState('CHOICE'); 
  const [selectedResult, setSelectedResult] = useState(null);
  const [flashState, setFlashState] = useState('NONE'); 

  // 💡 스토어에서 현재 runId와 day를 꺼냅니다.
  const { runId, day } = useGameStore();

  // 이벤트 DB
  const eventDB = {
    LOTTERY: { type: 'GACHA', title: '복권 판매점', choiceImg: 'event_lottery_choice.png', choiceText: '길가에 복권 가판대가 보인다. 하나 사볼까?', options: [{ label: '복권을 긁어본다', next: 'ROLL_DICE' }], probability: 0.05, winResult: { next: 'WIN', text: '축하합니다! 5만원에 당첨되었습니다.' }, loseResult: { next: 'LOSE', text: '역시... 꽝이다. 돈만 날렸네.' }, resultImgs: { WIN: 'event_lottery_win.png', LOSE: 'event_lottery_lose.png' } },
    BUTTON_100: { type: 'GACHA', title: '100억 버튼', choiceImg: 'event_button_press.png', choiceText: '버튼을 누르면 100억을 준다고?? 누군가의 장난이겠지?', options: [{ label: '눈 딱 감고 버튼을 누른다', next: 'ROLL_DICE' }], probability: 0.001, winResult: { next: 'SUCCESS', text: '세상에... 100억이 들어왔다!' }, loseResult: { next: 'FAILURE', text: '버튼을 눌렀지만 아무 일도 일어나지 않았다...' }, resultImgs: { SUCCESS: 'event_button_success.png', FAILURE: 'event_button_failure.png' } },
    JOB: { type: 'CHOICE', title: '꿀알바 공고', choiceImg: 'event_job_choice.png', choiceText: '카페 게시판에 급구 알바 공고가 떴다. 시급이 상당한데?', options: [{ label: '바로 지원하기', next: 'ACCEPT', text: '정신없었지만 일당은 넉넉히 받았다.' }, { label: '쉬고 싶다', next: 'DECLINE', text: '집에서 쉬는 게 최고지.' }], resultImgs: { ACCEPT: 'event_job_accept.png', DECLINE: 'event_job_decline.png' } },
    ILLEGAL: { type: 'CHOICE', title: '은밀한 제안', choiceImg: 'event_illegal_choice.png', choiceText: '누군가 검은 봉투를 건네며 창고로 와달라고 한다.', options: [{ label: '돈이 급하니 간다', next: 'ACCEPT', text: '찝찝하지만 지갑은 두둑해졌다.' }, { label: '무시하고 도망친다', next: 'DECLINE', text: '위험한 일에 엮이지 않는 게 상책이다.' }], resultImgs: { ACCEPT: 'event_illegal_accept.png', DECLINE: 'event_illegal_decline.png' } },
    LOST_ITEM: { type: 'CHOICE', title: '분실된 지갑', choiceImg: 'event_lostitem_choice.png', choiceText: '길바닥에 두툼한 지갑이 떨어져 있다.', options: [{ label: '경찰서에 신고한다', next: 'POLICE', text: '사례금을 조금 받았다. 마음이 편하다.' }, { label: '조용히 챙긴다', next: 'KEEP', text: '돈은 벌었지만 계속 뒤가 구리다.' }], resultImgs: { POLICE: 'event_lostitem_police.png', KEEP: 'event_lostitem_keep.png' } },
    ALLOWANCE: { type: 'SINGLE', title: '뜻밖의 용돈', image: 'event_allowance.png', text: '부모님께서 기특하다며 국밥 값 하라고 용돈을 주셨다.' },
    GOODS_SALE: { type: 'SINGLE', title: '스타 굿즈 판매', image: 'event_goods_sale.png', text: '한정판 굿즈가 드디어 팔렸다! 택배 상자에서 빛이 나는 것 같다.' },
    POLICE_ARREST: { type: 'SINGLE', title: '경찰 체포', image: 'event_police_arrest.png', text: '착하게 살걸... 착하게 살자...' }
  };

  const currentEvent = eventDB[eventType] || eventDB.ALLOWANCE;

  if (currentEvent.type === 'SINGLE' && stage === 'CHOICE') {
    setStage('RESULT');
    setSelectedResult({ text: currentEvent.text, img: currentEvent.image, isWin: false });
  }

  const handleChoice = (opt) => {
    // 💡 [핵심 추가] 선택 결과에 따른 백엔드 API 백그라운드 호출
    // 게임 진행(runId)이 존재할 때만 API를 쏩니다. (이벤트 테스트 모드 방어)
    if (runId) {
      if (eventType === 'ILLEGAL' && opt.next === 'ACCEPT') {
        // 불법 알바를 수락하면 3일 뒤 경찰 출두 예약
        gameApi.triggerPoliceEvent(runId, day).catch(e => console.error("경찰 이벤트 예약 실패:", e));
      } else if (eventType === 'LOST_ITEM' && opt.next === 'KEEP') {
        // 지갑을 조용히 챙기면 죄책감 이벤트 예약
        gameApi.triggerGuiltyEvent(runId, day).catch(e => console.error("죄책감 이벤트 예약 실패:", e));
      }
    }

    if (currentEvent.type === 'GACHA' && opt.next === 'ROLL_DICE') {
      const isWin = Math.random() < currentEvent.probability; // 당첨 결정
      const resultDef = isWin ? currentEvent.winResult : currentEvent.loseResult;
      setSelectedResult({ text: resultDef.text, img: currentEvent.resultImgs[resultDef.next], isWin });
      setStage('GACHA_WAIT');
    } else {
      setSelectedResult({ text: opt.text, img: currentEvent.resultImgs[opt.next], isWin: opt.next === 'SUCCESS' || opt.next === 'WIN' });
      setStage('RESULT');
    }
  };

  const handleGachaClick = () => {
    if (flashState !== 'NONE') return;
    if (selectedResult.isWin) {
      setFlashState('BUILDUP');
      setTimeout(() => { setFlashState('FLASHING'); setTimeout(() => { setStage('RESULT'); setTimeout(() => { setFlashState('NONE'); }, 800); }, 100); }, 1000); 
    } else {
      setFlashState('FLASHING');
      setTimeout(() => { setStage('RESULT'); setTimeout(() => { setFlashState('NONE'); }, 800); }, 100); 
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#1e3a5f', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
      
      <style>
        {`
          @keyframes shake-violent {
            0% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(-8px, 8px) rotate(-5deg); }
            50% { transform: translate(8px, -8px) rotate(5deg); }
            75% { transform: translate(-8px, -8px) rotate(-5deg); }
            100% { transform: translate(8px, 8px) rotate(5deg); }
          }
          .shake-active img { animation: shake-violent 0.1s linear infinite !important; box-shadow: 0 0 40px rgba(255,255,255,0.9) !important; border: 4px solid #FFD700 !important; }
          .glitter-effect { position: absolute; top: 35%; left: 50%; width: 0; height: 0; z-index: 55; pointer-events: none; }
        `}
      </style>

      {stage === 'RESULT' && selectedResult?.isWin && currentEvent.type === 'GACHA' && <Confetti />}

      <AnimatePresence>
        {flashState === 'FLASHING' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.1 } }} exit={{ opacity: 0, transition: { duration: 1.0, ease: 'easeOut' } }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#fff', zIndex: 9999 }} />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {stage !== 'RESULT' && (
          <motion.div key="choice" className={stage === 'GACHA_WAIT' ? 'shake-active' : ''} style={{ zIndex: 1, position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <EventChoice data={currentEvent} onSelect={handleChoice} />
            
            {stage === 'GACHA_WAIT' && (
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', cursor: 'pointer', zIndex: 50 }} onClick={handleGachaClick}>
                <div style={{ position: 'absolute', bottom: '15%', width: '100%', textAlign: 'center' }}>
                  <h2 style={{ color: '#FFD700', fontSize: '28px', textShadow: '2px 2px 0px #000' }}>▶ 한 번 더 클릭하세요! ◀</h2>
                </div>
                {flashState !== 'FLASHING' && (
                  <div className="glitter-effect">
                    {Array.from({ length: flashState === 'BUILDUP' ? 96 : 48 }).map((_, i) => (
                      <RainbowGlareParticle key={i} angle={i * (360 / (flashState === 'BUILDUP' ? 96 : 48))} isBuildup={flashState === 'BUILDUP'} />
                    ))}
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: flashState === 'BUILDUP' ? '120px' : '60px', height: flashState === 'BUILDUP' ? '120px' : '60px', backgroundColor: '#fff', borderRadius: '50%', filter: 'blur(15px) brightness(2)', boxShadow: '0 0 50px #fff', zIndex: 56, transition: 'all 0.5s' }} />
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {stage === 'RESULT' && (
          <motion.div key="result" initial={{ opacity: 1, scale: 1 }} animate={{ opacity: 1, scale: 1 }} style={{ zIndex: 100 }}>
            <div style={{ filter: (!selectedResult.isWin && currentEvent.type === 'GACHA') ? 'grayscale(100%) brightness(0.7)' : 'none', transition: 'filter 0.5s' }}>
              <EventResult title={currentEvent.title} data={selectedResult} onConfirm={() => onComplete(selectedResult)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventScene;