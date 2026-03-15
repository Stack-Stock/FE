import React from 'react';

// 💡 onInteract 하나로 버튼 클릭 이벤트를 일원화합니다.
const ActionButtons = ({ period, hoveredObject, onHover, onInteract }) => {
  
  const getBtnStyle = (id) => ({
    backgroundColor: hoveredObject === id ? '#8b9bb4' : '#696969',
    border: hoveredObject === id ? '3px solid #FFD700' : '3px solid #333',
    color: '#fff', fontSize: '16px', cursor: 'pointer',
    transition: 'all 0.1s ease-in-out',
    transform: hoveredObject === id ? 'scale(1.05)' : 'scale(1)'
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '8px', height: '100%' }}>
      <button style={getBtnStyle('PHONE')} onMouseEnter={() => onHover('PHONE')} onMouseLeave={() => onHover(null)} onClick={() => onInteract('PHONE')}>[스마트폰]</button>
      <button style={getBtnStyle('NEWSPAPER')} onMouseEnter={() => onHover('NEWSPAPER')} onMouseLeave={() => onHover(null)} onClick={() => onInteract('NEWSPAPER')}>[신문]</button>
      <button style={getBtnStyle('TV')} onMouseEnter={() => onHover('TV')} onMouseLeave={() => onHover(null)} onClick={() => onInteract('TV')}>[티비]</button>
      <button style={getBtnStyle('DESK')} onMouseEnter={() => onHover('DESK')} onMouseLeave={() => onHover(null)} onClick={() => onInteract('DESK')}>[공부하기]</button>
      <button style={getBtnStyle('LAPTOP')} onMouseEnter={() => onHover('LAPTOP')} onMouseLeave={() => onHover(null)} onClick={() => onInteract('LAPTOP')}>[투자하기]</button>
      <button style={getBtnStyle('BED')} onMouseEnter={() => onHover('BED')} onMouseLeave={() => onHover(null)} onClick={() => onInteract('BED')}>
        {period === 'MORNING' ? '[학교가기]' : '[잠자기]'}
      </button>
    </div>
  );
};

export default ActionButtons;