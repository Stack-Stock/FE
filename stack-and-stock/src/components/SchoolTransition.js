import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SchoolTransition = ({ targetEvent, onComplete }) => {
  const [phase, setPhase] = useState('LANDSCAPE');
  const publicPath = process.env.PUBLIC_URL;

  // 💡 글씨 가독성을 위해 사용할 공통 스타일 (반투명 검은색 상자)
  const textContainerStyle = {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: '15px 30px',
    borderRadius: '15px',
    color: '#fff',
    textAlign: 'center',
    display: 'inline-block' // 부모가 center 정렬일 때 내용물 크기에 맞게 조절
  };

  useEffect(() => {
    // 💡 모든 시간 값이 기존 대비 60%로 줄어들었습니다.
    const timer = setTimeout(() => {
      if (targetEvent === 'NORMAL_DAY') {
        setPhase('NORMAL_DAY');
        // 평범한 날 안내 문구 띄우고 1.8초 뒤 오후 세션으로 바로 종료 (기존 3초)
        setTimeout(onComplete, 1800); 
      } else {
        setPhase('EVENT_NOTICE'); // 이벤트 발생 연출
        // 깜빡임 효과 보여주고 1.1초 뒤 EventScene으로 이동 (기존 1.8초)
        setTimeout(onComplete, 1100); 
      }
    }, 1500); // 캠퍼스 풍경 감상 시간 (기존 2.5초)

    return () => clearTimeout(timer);
  }, [targetEvent, onComplete]);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#000', zIndex: 1200, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
      
      {/* 잔디밭 가방 에셋 (서서히 줌인) */}
      <motion.img 
        src={`${publicPath}/assets/help/help_5.png`} 
        initial={{ scale: 1 }}
        animate={{ scale: 1.05 }} 
        transition={{ duration: 1.8, ease: 'easeOut' }} // 💡 애니메이션 시간 단축 (기존 3초)
        style={{ width: '100%', height: '100%', objectFit: 'cover', imageRendering: 'pixelated' }}
      />

      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '10%', backgroundColor: '#000', zIndex: 10 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '10%', backgroundColor: '#000', zIndex: 10 }} />

      <AnimatePresence>
        {phase === 'LANDSCAPE' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.3 } }} exit={{ opacity: 0 }} // 💡 텍스트 등장 딜레이 단축 (기존 0.5초)
            style={{ ...textContainerStyle, position: 'absolute', bottom: '15%', zIndex: 11 }}>
            {/* 💡 textShadow 제거, textContainerStyle 적용 */}
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'normal' }}>
              어느덧 대학교 교정에 도착했다.
            </h2>
          </motion.div>
        )}

        {phase === 'EVENT_NOTICE' && (
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} 
            style={{ position: 'absolute', zIndex: 15, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.3 }} // 💡 깜빡임 주기 단축 (기존 0.5초)
              style={{ position: 'absolute', width: '400px', height: '200px', backgroundColor: '#ff4757', borderRadius: '50%', filter: 'blur(50px)', zIndex: -1 }} />
            
            {/* 💡 textShadow는 유지하되, textContainerStyle을 추가하여 가독성 확보 */}
            <div style={textContainerStyle}>
              <h1 style={{ margin: 0, fontSize: '70px', textShadow: '0 0 20px #ff4757, 4px 4px 0 #000', fontWeight: 'bold' }}>
                이벤트 발생!!
              </h1>
            </div>
          </motion.div>
        )}

        {phase === 'NORMAL_DAY' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
            style={{ ...textContainerStyle, position: 'absolute', bottom: '15%', zIndex: 15 }}>
             <p style={{ margin: 0, fontSize: '20px' }}>
               잔디밭의 이슬이 마를 무렵, 수업 종이 울렸다. 별다른 일은 없었다.
             </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SchoolTransition;