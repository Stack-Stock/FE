import React from 'react';

const ActionButtons = ({ period, hoveredObject, onHover, onInteract, isStudiedToday, isTvWatchedToday }) => {
  
  /**
   * 버튼 아이디별 스타일 반환
   */
  const getBtnStyle = (id) => {
    // 💡 비활성화 조건: 오늘 이미 완료한 활동 (공부, 티비)
    const isDisabled = (id === 'DESK' && isStudiedToday) || (id === 'TV' && isTvWatchedToday);
    
    if (isDisabled) {
      return {
        backgroundColor: '#333',
        border: '3px solid #222',
        color: '#666',
        fontSize: '16px',
        cursor: 'not-allowed',
        textDecoration: 'line-through', // 완료 느낌 강조
        boxShadow: 'none',
        opacity: 0.8
      };
    }

    // 일반 상태 및 호버 상태
    const isHovered = hoveredObject === id;
    return {
      backgroundColor: isHovered ? '#8b9bb4' : '#696969',
      border: isHovered ? '3px solid #FFD700' : '3px solid #333',
      color: '#fff',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'all 0.1s ease-in-out',
      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
      boxShadow: '2px 2px 0px rgba(0,0,0,0.5)',
      imageRendering: 'pixelated'
    };
  };

  // 이벤트 핸들러 래퍼 (비활성화 상태면 작동 안 함)
  const handleActionClick = (id) => {
    if (id === 'DESK' && isStudiedToday) return;
    if (id === 'TV' && isTvWatchedToday) return;
    onInteract(id);
  };

  const handleActionHover = (id) => {
    if (id === 'DESK' && isStudiedToday) return;
    if (id === 'TV' && isTvWatchedToday) return;
    onHover(id);
  };

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr 1fr', 
      gridTemplateRows: '1fr 1fr', 
      gap: '8px', 
      height: '100%' 
    }}>
      {/* 1행: 정보 수집 관련 */}
      <button style={getBtnStyle('PHONE')} 
        onMouseEnter={() => handleActionHover('PHONE')} onMouseLeave={() => onHover(null)} 
        onClick={() => handleActionClick('PHONE')}>
        [스마트폰]
      </button>

      <button style={getBtnStyle('TV')} 
        onMouseEnter={() => handleActionHover('TV')} onMouseLeave={() => onHover(null)} 
        onClick={() => handleActionClick('TV')}>
        {isTvWatchedToday ? '[시청완료]' : '[티비]'}
      </button>

      <button style={getBtnStyle('NEWSPAPER')} 
        onMouseEnter={() => handleActionHover('NEWSPAPER')} onMouseLeave={() => onHover(null)} 
        onClick={() => handleActionClick('NEWSPAPER')}>
        [신문]
      </button>
            
      {/* 2행: 메인 액션 및 진행 */}
      <button style={getBtnStyle('DESK')} 
        onMouseEnter={() => handleActionHover('DESK')} onMouseLeave={() => onHover(null)} 
        onClick={() => handleActionClick('DESK')}>
        {isStudiedToday ? '[공부완료]' : '[공부하기]'}
      </button>

      <button style={getBtnStyle('LAPTOP')} 
        onMouseEnter={() => handleActionHover('LAPTOP')} onMouseLeave={() => onHover(null)} 
        onClick={() => handleActionClick('LAPTOP')}>
        [투자하기]
      </button>

      <button style={getBtnStyle('BED')} 
        onMouseEnter={() => handleActionHover('BED')} onMouseLeave={() => onHover(null)} 
        onClick={() => handleActionClick('BED')}>
        {period === 'MORNING' ? '[학교가기]' : '[잠자기]'}
      </button>
    </div>
  );
};

export default ActionButtons;