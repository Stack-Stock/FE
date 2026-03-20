import React, { useState } from 'react';
import useGameStore from '../store/useGameStore'; // 💡 스토어 직접 호출

const ActionButtons = ({ hoveredObject, onHover, onInteract, isStudiedToday, isTvWatchedToday }) => {
  const [pressedBtn, setPressedBtn] = useState(null);

  // 💡 스토어에서 직접 정보 가져오기!
  const { period, day, isDemoMode } = useGameStore();
  const isLastDay = day >= (isDemoMode ? 5 : 80);

  const getBtnStyle = (id) => {
    const isDisabled = (id === 'DESK' && isStudiedToday) || (id === 'TV' && isTvWatchedToday);
    const isHovered = hoveredObject === id;
    const isPressed = pressedBtn === id;
    
    if (isDisabled) {
      return {
        backgroundColor: '#444',
        border: '3px solid #222',
        color: '#888',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'not-allowed',
        textDecoration: 'line-through',
        opacity: 0.8,
        borderRadius: '6px',
        boxShadow: 'none',
        transform: 'translateY(4px)' 
      };
    }

    return {
      backgroundColor: isHovered ? '#8b9bb4' : '#696969',
      border: isHovered ? '3px solid #FFD700' : '3px solid #333',
      color: '#fff',
      fontSize: '18px',
      fontWeight: 'bold',
      cursor: 'pointer',
      borderRadius: '6px',
      transition: 'background-color 0.1s ease-in-out, border 0.1s ease-in-out',
      transform: isPressed ? 'translateY(4px)' : 'translateY(0)',
      boxShadow: isPressed 
        ? 'none' 
        : (isHovered ? '0 4px 0 #b39700' : '0 4px 0 #222'),
      imageRendering: 'pixelated'
    };
  };

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

  const handleMouseDown = (id) => setPressedBtn(id);
  const handleMouseUp = () => setPressedBtn(null);
  const handleMouseLeave = (id) => {
    onHover(null);
    if (pressedBtn === id) setPressedBtn(null);
  };

  return (
    <div style={{ 
      display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '10px', height: '100%' 
    }}>
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
        {/* 💡 [핵심] 이제 무조건 스토어 값 기반으로 실시간 반영됩니다! */}
        {period === 'MORNING' ? '[학교가기]' : (isLastDay ? '[엔딩보기]' : '[잠자기]')}
      </button>
    </div>
  );
};

export default ActionButtons;