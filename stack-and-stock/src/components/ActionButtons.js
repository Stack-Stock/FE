import React from 'react';

// 💡 [핵심] isStudiedToday를 받아옵니다.
const ActionButtons = ({ period, hoveredObject, onHover, onInteract, isStudiedToday }) => {
  
  const getBtnStyle = (id) => {
    // 💡 공부하기(DESK) 버튼이면서 오늘 이미 공부했다면 비활성화 스타일 적용
    if (id === 'DESK' && isStudiedToday) {
      return {
        backgroundColor: '#444', border: '3px solid #222', color: '#888',
        fontSize: '16px', cursor: 'not-allowed', textDecoration: 'line-through'
      };
    }
    // 일반적인 호버 스타일
    return {
      backgroundColor: hoveredObject === id ? '#8b9bb4' : '#696969',
      border: hoveredObject === id ? '3px solid #FFD700' : '3px solid #333',
      color: '#fff', fontSize: '16px', cursor: 'pointer',
      transition: 'all 0.1s ease-in-out', transform: hoveredObject === id ? 'scale(1.05)' : 'scale(1)'
    };
  };

  // 비활성화 상태면 이벤트 자체를 무시하는 헬퍼 함수
  const handleMouseEnter = (id) => {
    if (id === 'DESK' && isStudiedToday) return;
    onHover(id);
  };
  const handleMouseLeave = (id) => {
    if (id === 'DESK' && isStudiedToday) return;
    onHover(null);
  };
  const handleClick = (id) => {
    if (id === 'DESK' && isStudiedToday) return;
    onInteract(id);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '8px', height: '100%' }}>
      <button style={getBtnStyle('PHONE')} onMouseEnter={() => handleMouseEnter('PHONE')} onMouseLeave={() => handleMouseLeave('PHONE')} onClick={() => handleClick('PHONE')}>[스마트폰]</button>
      <button style={getBtnStyle('NEWSPAPER')} onMouseEnter={() => handleMouseEnter('NEWSPAPER')} onMouseLeave={() => handleMouseLeave('NEWSPAPER')} onClick={() => handleClick('NEWSPAPER')}>[신문]</button>
      <button style={getBtnStyle('TV')} onMouseEnter={() => handleMouseEnter('TV')} onMouseLeave={() => handleMouseLeave('TV')} onClick={() => handleClick('TV')}>[티비]</button>
      
      {/* 💡 텍스트도 [공부완료]로 바뀝니다. */}
      <button style={getBtnStyle('DESK')} onMouseEnter={() => handleMouseEnter('DESK')} onMouseLeave={() => handleMouseLeave('DESK')} onClick={() => handleClick('DESK')}>
        {isStudiedToday ? '[공부완료]' : '[공부하기]'}
      </button>

      <button style={getBtnStyle('LAPTOP')} onMouseEnter={() => handleMouseEnter('LAPTOP')} onMouseLeave={() => handleMouseLeave('LAPTOP')} onClick={() => handleClick('LAPTOP')}>[투자하기]</button>
      <button style={getBtnStyle('BED')} onMouseEnter={() => handleMouseEnter('BED')} onMouseLeave={() => handleMouseLeave('BED')} onClick={() => handleClick('BED')}>
        {period === 'MORNING' ? '[학교가기]' : '[잠자기]'}
      </button>
    </div>
  );
};

export default ActionButtons;