import React, { useState, useEffect, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/EndingEffect.css';

// [해결] 입자 레이어를 독립 컴포넌트로 분리하고 memo로 감싸 리렌더링 간섭을 차단합니다.
const ParticleLayer = memo(({ effectType }) => {
  const count = 30;
  const particles = [];
  
  for (let i = 0; i < count; i++) {
    const style = {
      left: `${Math.random() * 100}%`,
      width: `${Math.random() * 5 + 2}px`,
      height: `${Math.random() * 5 + 2}px`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      animationDelay: `${Math.random() * 5}s`
    };
    
    let className = "particle";
    if (effectType === "gold") className += " gold-particle";
    if (effectType === "glitch") className += " red-glitch";
    if (effectType === "snow") className += " snow-particle"; // 필요 시 추가
    
    particles.push(<div key={i} className={className} style={style} />);
  }
  
  return <div className="particle-container">{particles}</div>;
});

const EndingScene = ({ onRestart, forcedType }) => {
  const [step, setStep] = useState('RESULT');
  const [displayText, setDisplayText] = useState('');
  const publicPath = process.env.PUBLIC_URL;

  const endingData = useMemo(() => ({
    GREAT_SUCCESS: {
      title: "대 성공 - 주식 천재",
      text: "이른 나이에 찾은 당신의 빛나는 재능! 다음 학기가 시작되기 전에 여행이라도 다녀오죠~",
      image: "ending_great_success.png",
      color: "#ffd700",
      glow: "rgba(255, 215, 0, 0.6)",
      effect: "gold"
    },
    SUCCESS: {
      title: "성공 - 성실한 투자자",
      text: "뉴스와 신문 기사로 찾아낸 투자의 길! 앞으로도 뉴스와 신문을 꾸준히 보면서 성실히 투자를 진행해 보세요!",
      image: "ending_success.png",
      color: "#ffffff",
      glow: "rgba(255, 255, 255, 0.4)",
      effect: "snow"
    },
    FAIL: {
      title: "실패 - 그런 시기도 있는 거죠...",
      text: "주식이 오를 때가 있으면 떨어질 때도 있는 거죠... 목표 금액을 채우지는 못했지만, 실패도 값진 경험이에요!",
      image: "ending_fail.png",
      color: "#aaaaaa",
      glow: "rgba(170, 170, 170, 0.3)",
      effect: "snow"
    },
    BANKRUPT: {
      title: "대 실패 - 파산",
      text: "순간의 섣부른 판단이 최악의 결과를 이끌어 낼때도 있어요... 현실에서는 조금 더 신중히 투자해봐요!",
      image: "ending_bankrupt.png",
      color: "#ff4b4b",
      glow: "rgba(255, 75, 75, 0.5)",
      effect: "glitch"
    },
    HIDDEN_STUDY: {
      title: "히든 - ㅎㅎ... 공부하기 싫어",
      text: "학생의 본분은 뭐니 뭐니 해도 공부! 당신은 투자에 너무 집중한 나머지 졸업 요건 중 하나인 영어 성적을 준비하지 못했어요...",
      image: "ending_hidden_study.png",
      color: "#00ffcc",
      glow: "rgba(0, 255, 204, 0.4)",
      effect: "snow"
    },
    HIDDEN_LUCK: {
      title: "히든 - 100억 버튼?! 이게 된다고!?",
      text: "때로는 뜻 하지 않는 곳에서 큰 행운이 찾아오는 법이에요. 주위를 잘 둘러보고 그 행운을 놓치지 마세요!",
      image: "ending_hidden_luck.png",
      color: "#ff00ff",
      glow: "rgba(255, 0, 255, 0.4)",
      effect: "gold"
    }
  }), []);

  const currentEnding = endingData[forcedType] || endingData.SUCCESS;

  // 타이핑 로직: currentEnding이 바뀔 때만 타이머가 시작됩니다.
  useEffect(() => {
    let i = 0;
    setDisplayText('');
    const fullText = currentEnding.text;
    
    const timer = setInterval(() => {
      i++;
      setDisplayText(fullText.substring(0, i));
      if (i >= fullText.length) clearInterval(timer);
    }, 50);
    
    return () => clearInterval(timer);
  }, [currentEnding]);

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#000', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      
      {/* 배경 효과 레이어: step이 RESULT일 때만 표시하며 독립 컴포넌트로 렌더링 */}
      {step === 'RESULT' && <ParticleLayer effectType={currentEnding.effect} />}

      <AnimatePresence mode="wait">
        {step === 'RESULT' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '60px', zIndex: 10 }}
          >
            <motion.h2 
              style={{ 
                fontSize: '40px', color: currentEnding.color, marginBottom: '40px',
                textShadow: `0 0 15px ${currentEnding.glow}, 2px 2px 4px rgba(0,0,0,0.8)` 
              }}
            >
              {currentEnding.title}
            </motion.h2>

            <div style={{ 
              width: '800px', height: '400px', border: '3px solid rgba(255, 255, 255, 0.8)',
              backgroundColor: '#111', overflow: 'hidden', marginBottom: '40px'
            }}>
              <img 
                src={`${publicPath}/assets/ending/${currentEnding.image}`} 
                alt="Ending" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>

            <div style={{ 
              width: '806px', minHeight: '90px', border: '2px solid rgba(255, 255, 255, 0.5)',
              padding: '20px 25px', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center' 
            }}>
              <p style={{ fontSize: '20px', lineHeight: '1.6', wordBreak: 'keep-all' }}>
                {displayText}
                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }}>_</motion.span>
              </p>
            </div>

            <div style={{ position: 'absolute', bottom: '50px', right: '60px', display: 'flex', gap: '20px' }}>
              <button className="pixel-btn" onClick={() => setStep('CREDIT')}>엔딩크레딧 보러 가기</button>
              <button className="pixel-btn" style={{ background: '#333' }} onClick={onRestart}>메인으로</button>
            </div>
          </motion.div>
        )}

        {step === 'CREDIT' && (
          <motion.div 
            key="credit"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', backgroundColor: '#000' }}
          >
            <motion.div 
              initial={{ y: 720 }} 
              animate={{ y: -1200 }} 
              transition={{ duration: 15, ease: "linear" }}
              style={{ textAlign: 'center', paddingTop: '100px' }}
            >
              <h1 style={{ fontSize: '64px', marginBottom: '100px', color: currentEnding.color }}>{currentEnding.title}</h1>
              <h2 style={{ marginBottom: '50px' }}>STAFF</h2>
              <p style={{ fontSize: '24px', marginBottom: '30px' }}>Director: 조재웅</p>
              <p style={{ fontSize: '24px', marginBottom: '30px' }}>Team: 나우유씨미;런타임에러</p>
              <p style={{ fontSize: '24px', marginBottom: '30px' }}>Design: SSAFY 14th</p>
              <p style={{ fontSize: '24px', marginBottom: '300px' }}>Powered by React & Spring Boot</p>
              <h2 style={{ marginBottom: '50px' }}>SPECIAL THANKS</h2>
              <p style={{ fontSize: '24px', marginBottom: '30px' }}>SSAFY Instructors</p>
              <p style={{ fontSize: '24px', marginBottom: '400px' }}>And You, The Investor</p>
              <h1 style={{ fontSize: '48px' }}>THANK YOU FOR PLAYING</h1>
            </motion.div>
            
            <button 
              className="pixel-btn" 
              style={{ position: 'absolute', bottom: '50px', left: '50%', transform: 'translateX(-50%)' }}
              onClick={onRestart}
            >
              다시 시작하기
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EndingScene;