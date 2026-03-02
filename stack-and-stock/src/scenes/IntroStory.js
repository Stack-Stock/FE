import React, { useState } from 'react';

const IntroStory = ({ onComplete }) => {
  const [currentCut, setCurrentCut] = useState(0);

  // 스토리 데이터 (나중에 이미지를 assets에 넣으면 image 경로를 수정하세요)
  const storyCuts = [
    {
      text: "평범한 기계공학 전공생이었던 나, 어느 날 개발의 매력에 빠져버렸다.",
      bg: "#222" // 임시 배경색 (나중에 이미지 에셋으로 교체)
    },
    {
      text: "SSAFY 14기에 합격하여 AI와 자바를 배우며 밤낮으로 코딩에 매진했다.",
      bg: "#333"
    },
    {
      text: "이제는 실전이다! 10일 동안 프로젝트를 성공시켜 최고의 개발자가 되어보자.",
      bg: "#444"
    },
    {
      text: "나우유씨미;런타임에러 팀과 함께하는 위대한 여정이 지금 시작된다.",
      bg: "#555"
    }
  ];

  const handleNext = () => {
    if (currentCut < storyCuts.length - 1) {
      setCurrentCut(currentCut + 1);
    } else {
      onComplete(); // 마지막 컷이면 게임 시작
    }
  };

  return (
    <div style={{ 
      width: '100%', height: '100%', 
      backgroundColor: storyCuts[currentCut].bg,
      display: 'flex', flexDirection: 'column', 
      justifyContent: 'center', alignItems: 'center',
      color: 'white', position: 'relative'
    }}>
      {/* 컷 번호 표시 */}
      <div style={{ position: 'absolute', top: '50px', right: '50px', fontSize: '20px' }}>
        {currentCut + 1} / {storyCuts.length}
      </div>

      {/* 스토리 이미지 영역 (나중에 <img> 태그로 교체 가능) */}
      <div style={{ 
        width: '800px', height: '400px', border: '4px solid white',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        marginBottom: '40px', fontSize: '24px'
      }}>
        {/* <img src={`/assets/intro/cut_${currentCut}.png`} alt="story" /> */}
        [스토리 컷 {currentCut + 1} 이미지 영역]
      </div>

      {/* 대사창 */}
      <div style={{ 
        width: '900px', height: '150px', background: 'rgba(0,0,0,0.8)',
        border: '4px solid #fff', padding: '30px', boxSizing: 'border-box',
        cursor: 'pointer'
      }} onClick={handleNext}>
        <p style={{ fontSize: '22px', lineHeight: '1.6', textAlign: 'center' }}>
          {storyCuts[currentCut].text}
        </p>
        <p style={{ textAlign: 'right', marginTop: '10px', fontSize: '14px', color: '#aaa' }}>
          [클릭하여 계속]
        </p>
      </div>
    </div>
  );
};

export default IntroStory;