import React from 'react';
import { HELP_DATA } from '../../data/helpData';

const HelpContent = ({ currentIndex, setCurrentIndex }) => {
  const currentData = HELP_DATA[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === HELP_DATA.length - 1;

  const handlePrev = () => { if (!isFirst) setCurrentIndex(prev => prev - 1); };
  const handleNext = () => { if (!isLast) setCurrentIndex(prev => prev + 1); };

  const arrowBtnStyle = {
    padding: '10px 20px', fontSize: '20px', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer',
    backgroundColor: '#34495e', color: '#fff', border: '3px solid #2c3e50',
    transition: 'all 0.1s'
  };

  const disabledArrowStyle = { ...arrowBtnStyle, backgroundColor: '#222', color: '#555', border: '3px solid #111', cursor: 'not-allowed' };

  return (
    <div style={{ flex: '1 1 70%', display: 'flex', flexDirection: 'column', backgroundColor: '#0a0a0a', border: '3px solid #2f3640', borderRadius: '8px', padding: '20px' }}>
      
      <h3 style={{ color: '#fff', fontSize: '22px', borderBottom: '2px solid #333', paddingBottom: '10px', marginTop: 0 }}>
        {currentData.title}
      </h3>

      {/* 💡 이미지 영역 (이미지가 없을 경우를 대비한 대체 박스 포함) */}
      <div style={{ flex: 1, backgroundColor: '#111', borderRadius: '8px', border: '2px solid #222', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', overflow: 'hidden' }}>
        <img 
          src={currentData.image} 
          alt={currentData.title} 
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = ''; 
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex'; // 에러 시 텍스트 표시
          }}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
        <div style={{ display: 'none', color: '#555', fontSize: '14px' }}>[ 이미지가 추가될 예정입니다 ({currentData.image}) ]</div>
      </div>

      {/* 💡 설명 텍스트 영역 */}
      <div style={{ backgroundColor: '#1a1a2e', padding: '15px', borderRadius: '8px', border: '1px solid #333', minHeight: '80px', marginBottom: '20px' }}>
        <p style={{ color: '#d1d8e0', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>
          {currentData.description}
        </p>
      </div>

      {/* 💡 화살표 내비게이션 영역 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <button onClick={handlePrev} disabled={isFirst} style={isFirst ? disabledArrowStyle : arrowBtnStyle}>
          &lt; 이전
        </button>
        <button onClick={handleNext} disabled={isLast} style={isLast ? disabledArrowStyle : arrowBtnStyle}>
          다음 &gt;
        </button>
      </div>
      
    </div>
  );
};

export default HelpContent;