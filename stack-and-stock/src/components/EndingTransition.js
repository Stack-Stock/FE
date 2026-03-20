import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EndingTransition = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // 💡 읽을 수 있는 최소 시간 확보! (1.5초마다 변경, 총 4.5초 소요)
    const t1 = setTimeout(() => setPhase(1), 1500);
    const t2 = setTimeout(() => setPhase(2), 3000);
    const t3 = setTimeout(() => onComplete(), 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  const texts = [
    "숨 가쁘게 달려온 투자의 시간들...",
    "수많은 정보 속에서 당신이 내린 선택...",
    "이제, 그 결과를 마주할 시간입니다."
  ];

  return (
    <div style={{ 
      width: '100%', height: '100%', backgroundColor: '#000', 
      display: 'flex', justifyContent: 'center', alignItems: 'center' 
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={phase} // phase가 바뀔 때마다 애니메이션이 새로 실행됨
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }} // 💡 [핵심] 페이드인/아웃을 0.2초 만에 끝내버리고 글자를 오래 보여줌!
          style={{ 
            color: '#fff', 
            fontSize: '28px', 
            letterSpacing: '3px', 
            fontWeight: '300',
            textShadow: '0 0 10px rgba(255,255,255,0.3)' // 살짝 빛나는 효과
          }}
        >
          {texts[phase]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default EndingTransition;