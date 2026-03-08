import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IntroStory = ({ onComplete }) => {
  const [scene, setScene] = useState(1);
  const [subStep, setSubStep] = useState(1);
  const [workerFrame, setWorkerFrame] = useState(1); // 현재 프레임
  const [prevWorkerFrame, setPrevWorkerFrame] = useState(1); // 버퍼용 이전 프레임
  const [isShaking, setIsShaking] = useState(false); // Scene 4 흔들림 상태

  const publicPath = process.env.PUBLIC_URL;
  const imgPath = `${publicPath}/assets/intro`;

  // Scene 3 애니메이션 루프
  useEffect(() => {
    let timer;
    if (scene === 3) {
      timer = setInterval(() => {
        // 현재 프레임을 이전 프레임으로 저장 후 교체
        setPrevWorkerFrame(workerFrame);
        setWorkerFrame((prev) => (prev === 1 ? 2 : 1));
      }, 2000); // 5초 간격
    }
    return () => clearInterval(timer);
  }, [scene, workerFrame]);

  // Scene 4 진입 시 0.5초간 흔들림 효과
  useEffect(() => {
    if (scene === 4 && subStep === 1) {
      setIsShaking(true);
      const timer = setTimeout(() => {
        setIsShaking(false);
      }, 500); 
      return () => clearTimeout(timer);
    } else {
      setIsShaking(false);
    }
  }, [scene, subStep]);

  const handleNext = () => {
    if (scene === 1) {
      if (subStep === 1) setSubStep(2);
      else { setScene(2); setSubStep(1); }
    } 
    else if (scene === 4) {
      if (subStep === 1) setSubStep(2);
      else { setScene(5); setSubStep(1); }
    }
    else if (scene === 5) {
      if (subStep === 1) setSubStep(2);
      else { setScene(6); setSubStep(1); }
    }
    else if (scene === 6) {
      if (subStep === 1) setSubStep(2);
      else onComplete();
    }
    else {
      setScene(prev => prev + 1);
      setSubStep(1);
    }
  };

  const storyTexts = {
    1: "다음 학기 등록금은 어떻게 모으지... 부모님께 손을 빌리고 싶지는 않고, 통장 잔고는 바닥을 보이고 있어.",
    2: "등록금 5,000,000원... 나같이 가난한 대학생에게는 너무나 큰 부담이 되는 금액이야...",
    3: "잠을 줄여가며 야간 알바를 뛰었지만, 학업과 병행하기에는 너무 무리가 커.",
    4: "여러 알바를 병행하더라도... 과연 내가 지치지 않고 돈을 잘 모을 수 있을까?",
    5: "아르바이트 보다 매경미디어의 뉴스/기사를 보면서 주식을 해보자! 주식으로 돈을 모아보는 거야.",
    6: "이제 준비는 끝났다. 런타임 에러 없는 완벽한 수익 모델을 구축해 보자!"
  };

  return (
    <div className="intro-container">
      <div className="scene-display">
        {/* Scene 1: 고지서 등장 */}
        {scene === 1 && (
          <>
            <img src={`${imgPath}/tutorial1-1.jpg`} alt="desk" className="base-img" />
            <AnimatePresence>
              {subStep === 2 && (
                <motion.img 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={`${imgPath}/tutorial1-2.jpg`} 
                  className="base-img"
                  style={{ position: 'absolute', top: 0, left: 0 }}
                />
              )}
            </AnimatePresence>
          </>
        )}

        {/* Scene 2: 숫자 강조 */}
        {scene === 2 && <img src={`${imgPath}/tutorial1-3.jpg`} alt="amount" className="base-img" />}

        {/* Scene 3: 편의점 알바 루프 (자연스러운 전환 적용) */}
        {scene === 3 && (
          <div className="base-img" style={{ position: 'relative' }}>
            {/* 버퍼 레이어: 깜빡임 방지용 정지 이미지 */}
            <img 
              src={prevWorkerFrame === 1 ? `${imgPath}/tutorial2-1.jpg` : `${imgPath}/tutorial2-2-2.jpg`} 
              alt="buffer" 
              className="base-img"
              style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
            />
            {/* 애니메이션 레이어: 페이드 인/아웃 */}
            <AnimatePresence mode="popLayout">
              <motion.img 
                key={`worker-${workerFrame}`}
                src={workerFrame === 1 ? `${imgPath}/tutorial2-1.jpg` : `${imgPath}/tutorial2-2-2.jpg`} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }} // 부드러운 전환 시간
                alt="working" 
                className="base-img" 
                style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
              />
            </AnimatePresence>
          </div>
        )}

        {/* Scene 4: 무한 반복의 늪 */}
        {scene === 4 && (
          <div className={`base-img ${isShaking ? 'shake-effect' : ''}`}>
            <img 
              src={subStep === 1 ? `${imgPath}/tutorial3-1.jpg` : `${imgPath}/tutorial3-2.jpg`} 
              alt="exhausted" 
              className="base-img" 
            />
          </div>
        )}

        {/* Scene 5 & 6은 기존과 동일하되 동일한 imgPath 패턴 유지 */}
        {scene === 5 && (
          <>
            <img src={`${imgPath}/tutorial5-1.jpg`} alt="desk" className="base-img" />
            <AnimatePresence>
              {subStep === 2 && (
                <motion.img 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={`${imgPath}/tutorial5-2.jpg`} 
                  className="base-img"
                  style={{ position: 'absolute', top: 0, left: 0 }}
                />
              )}
            </AnimatePresence>
          </>
        )}

        {scene === 6 && (
          <>
            <img src={`${imgPath}/tutorial6-1.jpg`} alt="laptop" className="base-img" />
            <AnimatePresence>
              {subStep === 2 && (
                <motion.img 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={`${imgPath}/tutorial6-2.jpg`} 
                  className="base-img"
                  style={{ position: 'absolute', top: 0, left: 0 }}
                />
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* 대사창 */}
      <div className="dialog-box" onClick={handleNext}>
        <motion.p 
          key={scene}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="dialog-text"
        >
          {storyTexts[scene]}
        </motion.p>
        <span className="click-hint">[클릭하여 계속]</span>
      </div>
    </div>
  );
};

export default IntroStory;