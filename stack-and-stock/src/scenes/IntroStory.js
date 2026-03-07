import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IntroStory = ({ onComplete }) => {
  const [scene, setScene] = useState(1);
  const [subStep, setSubStep] = useState(1);

  // 리액트 public 폴더의 절대 경로를 안전하게 가져옵니다.
  const publicPath = process.env.PUBLIC_URL;
  const imgPath = `${publicPath}/assets/intro`;

  const handleNext = () => {
    if (scene === 1) {
      if (subStep === 1) {
        setSubStep(2); // 고지서 등장
      } else {
        setScene(2); // Scene 2로 이동
        setSubStep(1);
      }
    } else if (scene === 2) {
      setScene(3);
    } else if (scene === 3) {
      setScene(4);
    } else if (scene === 6) {
      onComplete();
    } else {
      setScene(prev => prev + 1);
    }
  };

  const storyTexts = {
    1: "다음 학기 등록금은 어떻게 모으지... 부모님께 손을 빌리고 싶지는 않고, 통장 잔고는 바닥을 보이고 있어.",
    2: "등록금 5,000,000원... 나같이 가난한 대학생에게는 너무나 큰 부담이 되는 금액이야...",
    3: "잠을 줄여가며 야간 알바를 뛰었지만, 학업과 병행하기에는 너무 무리가 커.",
  };

  return (
    <div className="intro-container">
      <div className="scene-display">
        {/* Scene 1 연출 */}
        {scene === 1 && (
          <>
            <img src={`${imgPath}/tutorial1-1.jpg`} alt="desk" className="base-img" />
            <AnimatePresence>
              {subStep === 2 && (
                <motion.img 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={`${imgPath}/tutorial1-2.jpg`} 
                  alt="bill"
                  className="base-img"
                  style={{ position: 'absolute', top: 0, left: 0 }}
                />
              )}
            </AnimatePresence>
          </>
        )}

        {/* Scene 2 연출 */}
        {scene === 2 && (
          <img src={`${imgPath}/tutorial1-3.jpg`} alt="5,000,000 won" className="base-img" />
        )}

        {/* Scene 3 (이미지 준비됨에 따라 추가 가능) */}
        {scene === 3 && (
          <img src={`${imgPath}/tutorial2-1.jpg`} alt="convenience store" className="base-img" />
        )}
      </div>

      {/* 대사창: key={scene}으로 두어 subStep 변경 시에는 텍스트가 깜빡이지 않음 */}
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