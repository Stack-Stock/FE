import React, { useState } from 'react';

const ActionButtons = ({ period, hoveredObject, onHover, onInteract, isStudiedToday, isTvWatchedToday }) => {
  // 💡 마우스로 버튼을 누르고 있는 상태를 추적하여 물리 버튼 효과를 줍니다.
  const [pressedBtn, setPressedBtn] = useState(null);

  /**
   * 버튼 아이디별 스타일 반환
   */
  const getBtnStyle = (id) => {
    // 비활성화 조건
    const isDisabled = (id === 'DESK' && isStudiedToday) || (id === 'TV' && isTvWatchedToday);
    const isHovered = hoveredObject === id;
    const isPressed = pressedBtn === id;
    
    if (isDisabled) {
      return {
        backgroundColor: '#444', // 기존 #333 보다 살짝 밝게 하여 음각 느낌 부여
        border: '3px solid #222',
        color: '#888',
        fontSize: '18px', // 💡 글씨 크기 확대 (기존 16px)
        fontWeight: 'bold', // 💡 글씨 굵게
        cursor: 'not-allowed',
        textDecoration: 'line-through',
        opacity: 0.8,
        borderRadius: '6px',
        // 💡 비활성화된 버튼은 이미 꾹 눌려있는 것처럼 연출
        boxShadow: 'none',
        transform: 'translateY(4px)' 
      };
    }

    // 일반 상태 및 호버 상태
    return {
      backgroundColor: isHovered ? '#8b9bb4' : '#696969',
      border: isHovered ? '3px solid #FFD700' : '3px solid #333',
      color: '#fff',
      fontSize: '18px', // 💡 글씨 크기 확대 (기존 16px)
      fontWeight: 'bold', // 💡 글씨 굵게
      cursor: 'pointer',
      borderRadius: '6px',
      // 색상 변경만 부드럽게 하고, 눌리는 모션은 즉각적으로 반응하도록 분리
      transition: 'background-color 0.1s ease-in-out, border 0.1s ease-in-out',
      
      // 💡 [핵심] 입체감과 눌림 효과 (물리 버튼 연출)
      transform: isPressed ? 'translateY(4px)' : 'translateY(0)',
      boxShadow: isPressed 
        ? 'none' 
        : (isHovered ? '0 4px 0 #b39700' : '0 4px 0 #222'), // 호버 시 그림자도 노란색 톤으로
        
      imageRendering: 'pixelated'
    };
  };

  // 이벤트 핸들러 래퍼
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

  // 💡 마우스 눌림/뗌 처리를 위한 래퍼
  const handleMouseDown = (id) => setPressedBtn(id);
  const handleMouseUp = () => setPressedBtn(null);
  const handleMouseLeave = (id) => {
    onHover(null);
    if (pressedBtn === id) setPressedBtn(null); // 마우스가 벗어나면 눌림 상태도 해제
  };

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr 1fr', 
      gridTemplateRows: '1fr 1fr', 
      gap: '10px', // 버튼이 커져서 간격을 8px -> 10px로 살짝 넓힘
      height: '100%' 
    }}>
      {/* 1행: 정보 수집 관련 */}
      <button style={getBtnStyle('PHONE')} 
        onMouseEnter={() => handleActionHover('PHONE')} onMouseLeave={() => handleMouseLeave('PHONE')} 
        onMouseDown={() => handleMouseDown('PHONE')} onMouseUp={handleMouseUp}
        onClick={() => handleActionClick('PHONE')}>
        [스마트폰]
      </button>

      <button style={getBtnStyle('TV')} 
        onMouseEnter={() => handleActionHover('TV')} onMouseLeave={() => handleMouseLeave('TV')} 
        onMouseDown={() => handleMouseDown('TV')} onMouseUp={handleMouseUp}
        onClick={() => handleActionClick('TV')}>
        {isTvWatchedToday ? '[시청완료]' : '[티비]'}
      </button>

      <button style={getBtnStyle('NEWSPAPER')} 
        onMouseEnter={() => handleActionHover('NEWSPAPER')} onMouseLeave={() => handleMouseLeave('NEWSPAPER')} 
        onMouseDown={() => handleMouseDown('NEWSPAPER')} onMouseUp={handleMouseUp}
        onClick={() => handleActionClick('NEWSPAPER')}>
        [신문]
      </button>
            
      {/* 2행: 메인 액션 및 진행 */}
      <button style={getBtnStyle('DESK')} 
        onMouseEnter={() => handleActionHover('DESK')} onMouseLeave={() => handleMouseLeave('DESK')} 
        onMouseDown={() => handleMouseDown('DESK')} onMouseUp={handleMouseUp}
        onClick={() => handleActionClick('DESK')}>
        {isStudiedToday ? '[공부완료]' : '[공부하기]'}
      </button>

      <button style={getBtnStyle('LAPTOP')} 
        onMouseEnter={() => handleActionHover('LAPTOP')} onMouseLeave={() => handleMouseLeave('LAPTOP')} 
        onMouseDown={() => handleMouseDown('LAPTOP')} onMouseUp={handleMouseUp}
        onClick={() => handleActionClick('LAPTOP')}>
        [투자하기]
      </button>

      <button style={getBtnStyle('BED')} 
        onMouseEnter={() => handleActionHover('BED')} onMouseLeave={() => handleMouseLeave('BED')} 
        onMouseDown={() => handleMouseDown('BED')} onMouseUp={handleMouseUp}
        onClick={() => handleActionClick('BED')}>
        {period === 'MORNING' ? '[학교가기]' : '[잠자기]'}
      </button>
    </div>
  );
};

export default ActionButtons;