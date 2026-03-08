import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScene = ({ onComplete }) => {
  const [step, setStep] = useState(1); // 1: 팀 로고, 2: 게임 로고
  const publicPath = process.env.PUBLIC_URL;

  useEffect(() => {
    // 팀 로고 노출 시간 (2초 후 전환 - 페이드 인/아웃 시간을 고려해 조금 늘림)
    const timer1 = setTimeout(() => setStep(2), 800);
    // 전체 종료 시간 (총 4.2초)
    const timer2 = setTimeout(onComplete, 3400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  // [수정] 심장박동 주기: 1.5초 -> 3초로 변경하여 훨씬 천천히 호흡하도록 설정
  const pulseAnimation = {
    scale: [1, 1.02, 1], // 아주 미세하게 커졌다가 돌아옴 (1.03 -> 1.02)
    transition: {
      duration: 3,       // 한 번의 호흡을 3초로 늘림
      repeat: Infinity,
      ease: "easeInOut"  // 부드러운 가속/감속
    }
  };

  return (
    <div style={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', 
      height: '100%', backgroundColor: '#000', position: 'relative',
      overflow: 'hidden'
    }}>
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="team-logo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02 }} // 사라질 때 살짝 커지며 페이드아웃
            transition={{ duration: 1.2 }}     // 나타나고 사라지는 시간을 더 부드럽게
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <motion.img 
              src={`${publicPath}/assets/loading/team_logo.png`} 
              alt="Team Logo" 
              style={{ width: '360px', height: 'auto', imageRendering: 'pixelated' }}
              animate={pulseAnimation}
              onDragStart={(e) => e.preventDefault()}
            />
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              style={{ 
                color: '#fff', marginTop: '30px', letterSpacing: '8px', 
                fontSize: '14px', fontWeight: '300' 
              }}
            >
              PRESENTED BY TEAM NYSM
            </motion.p>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="game-logo"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <motion.img 
              src={`${publicPath}/assets/loading/game_logo.png`} 
              alt="Game Logo" 
              style={{ width: '450px', height: 'auto', imageRendering: 'pixelated' }}
              animate={pulseAnimation}
              onDragStart={(e) => e.preventDefault()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoadingScene;