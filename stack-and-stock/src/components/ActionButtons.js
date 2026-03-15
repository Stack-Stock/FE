import React from 'react';

// 💡 [핵심] hoveredObject를 props로 받아옵니다.
const ActionButtons = ({ period, hoveredObject, onHover, onAction, onNewsClick }) => {
  
  // 💡 버튼 활성화 여부에 따라 스타일을 다르게 주는 함수
  const getBtnStyle = (id) => ({
    backgroundColor: hoveredObject === id ? '#8b9bb4' : '#696969', // 호버 시 밝은 색
    border: hoveredObject === id ? '3px solid #FFD700' : '3px solid #333', // 호버 시 노란색 테두리
    color: '#fff', 
    fontSize: '16px', 
    cursor: 'pointer',
    transition: 'all 0.1s ease-in-out'
  });

  return (
    <div style={{ 
      display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '8px', height: '100%'
    }}>
      {/* 스마트폰 (PHONE) */}
      <button className="pixel-btn" style={getBtnStyle('PHONE')} onMouseEnter={() => onHover('PHONE')} onMouseLeave={() => onHover(null)}>
        [스마트폰]
      </button>

      {/* 신문 (NEWSPAPER) */}
      <button className="pixel-btn" style={getBtnStyle('NEWSPAPER')} onMouseEnter={() => onHover('NEWSPAPER')} onMouseLeave={() => onHover(null)} onClick={onNewsClick}>
        [신문]
      </button>

      {/* 티비 (TV) */}
      <button className="pixel-btn" style={getBtnStyle('TV')} onMouseEnter={() => onHover('TV')} onMouseLeave={() => onHover(null)}>
        [티비]
      </button>

      {/* 공부하기 (DESK) */}
      <button className="pixel-btn" style={getBtnStyle('DESK')} onMouseEnter={() => onHover('DESK')} onMouseLeave={() => onHover(null)}>
        [공부하기]
      </button>

      {/* 💡 투자하기 (LAPTOP) : 호버 ID를 LAPTOP으로 일치시켰습니다. */}
      <button className="pixel-btn" style={getBtnStyle('LAPTOP')} onMouseEnter={() => onHover('LAPTOP')} onMouseLeave={() => onHover(null)}>
        [투자하기]
      </button>

      {/* 학교가기 / 잠자기 (BED) */}
      <button className="pixel-btn" style={getBtnStyle('BED')} onMouseEnter={() => onHover('BED')} onMouseLeave={() => onHover(null)} onClick={onAction}>
        {period === 'MORNING' ? '[학교가기]' : '[잠자기]'}
      </button>
    </div>
  );
};

export default ActionButtons;