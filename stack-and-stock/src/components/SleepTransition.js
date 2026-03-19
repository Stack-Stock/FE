import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SleepTransition = ({ day, onComplete }) => {
  const [phase, setPhase] = useState('NIGHT_END');
  const publicPath = process.env.PUBLIC_URL;

  const textContainerStyle = {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: '15px 30px',
    borderRadius: '15px',
    color: '#fff',
    textAlign: 'center',
    display: 'inline-block' 
  };

  useEffect(() => {
    // 💡 [수정] 모든 타이머를 기존 대비 60%로 단축 (1200->720, 2400->1440, 3600->2160)
    const timer1 = setTimeout(() => setPhase('SLEEPING'), 720);
    const timer2 = setTimeout(() => setPhase('MORNING_START'), 1440);
    const timer3 = setTimeout(onComplete, 2160); 

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#000', zIndex: 1200, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
      
      <motion.img 
        src={`${publicPath}/assets/help/help_6.png`} 
        initial={{ scale: 1 }}
        animate={{ scale: 1.05 }} 
        // 💡 [수정] 이미지 줌인 애니메이션 시간도 3.6 -> 2.16으로 단축
        transition={{ duration: 2.16, ease: 'linear' }}
        style={{ width: '100%', height: '100%', objectFit: 'cover', imageRendering: 'pixelated', opacity: 0.6 }}
      />

      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '10%', backgroundColor: '#000', zIndex: 10 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '10%', backgroundColor: '#000', zIndex: 10 }} />

      <AnimatePresence mode="wait">
        {phase === 'NIGHT_END' && (
          <motion.div key="night" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            style={{ ...textContainerStyle, position: 'absolute', bottom: '15%', zIndex: 11 }}>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'normal' }}>
              DAY {day - 1} 종료...
            </h2>
          </motion.div>
        )}

        {phase === 'SLEEPING' && (
          <motion.div key="sleep" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} 
            style={{ position: 'absolute', zIndex: 15, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={textContainerStyle}>
              <h1 style={{ margin: 0, fontSize: '50px', fontWeight: 'bold', fontStyle: 'italic', letterSpacing: '3px' }}>
                Zzz...
              </h1>
            </div>
          </motion.div>
        )}

        {phase === 'MORNING_START' && (
          <motion.div key="morning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            style={{ ...textContainerStyle, position: 'absolute', bottom: '15%', zIndex: 15 }}>
             <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#FFD700' }}>
               DAY {day} 아침이 밝았다.
             </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SleepTransition;