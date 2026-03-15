import React from 'react';

const ActionButtons = ({ onHover, onAction, onNewsClick }) => {
  // 공통 버튼 스타일 정의
  const btnStyle = { 
    backgroundColor: '#696969', 
    border: '3px solid #333', 
    color: '#fff', 
    fontSize: '16px', // 💡 기존 18px -> 16px로 축소하여 버튼 크기에 맞춤
    cursor: 'pointer'
  };

  return (
    <div style={{ 
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr', 
      gridTemplateRows: '1fr 1fr',       
      gap: '8px', // 간격도 살짝 줄임
      height: '100%'
    }}>
      <button className="pixel-btn" style={btnStyle} onMouseEnter={() => onHover('COMPUTER')} onMouseLeave={() => onHover(null)}>
        [투자하기]
      </button>
      <button className="pixel-btn" style={btnStyle} onMouseEnter={() => onHover('DESK')} onMouseLeave={() => onHover(null)}>
        [공부하기]
      </button>
      <button className="pixel-btn" style={btnStyle} onMouseEnter={() => onHover('BED')} onMouseLeave={() => onHover(null)} onClick={onAction}>
        [잠자기]
      </button>
      <button className="pixel-btn" style={btnStyle} onMouseEnter={() => onHover('PHONE')} onMouseLeave={() => onHover(null)}>
        [스마트폰]
      </button>
      <button className="pixel-btn" style={btnStyle} onMouseEnter={() => onHover('NEWSPAPER')} onMouseLeave={() => onHover(null)} onClick={onNewsClick}>
        [신문]
      </button>
      <button className="pixel-btn" style={btnStyle} onMouseEnter={() => onHover('TV')} onMouseLeave={() => onHover(null)}>
        [티비]
      </button>
    </div>
  );
};

export default ActionButtons;