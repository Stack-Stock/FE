import React from 'react';

const ActionButtons = ({ period, onHover, onAction }) => {
  // 현재 시간대(period)에 따른 버튼 구성
  const isMorning = period === 'MORNING';

  const buttons = [
    { id: 'INVEST', label: '투자하기', target: 'COMPUTER' },
    { id: 'STUDY', label: '공부하기', target: 'DESK' },
    { 
      id: 'NEXT', 
      label: isMorning ? '학교가기' : '잠자기', 
      target: isMorning ? 'DOOR' : 'BED' 
    },
    { id: 'PHONE', label: '스마트폰', target: 'PHONE' },
    { id: 'NEWS', label: '신문', target: 'NEWSPAPER' },
    { id: 'TV', label: '티비', target: 'TV' },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '10px',
      width: '600px',
      margin: '0 auto'
    }}>
      {buttons.map((btn) => (
        <button
          key={btn.id}
          className="pixel-btn"
          style={{ fontSize: '18px', padding: '15px' }}
          onMouseEnter={() => onHover(btn.target)} // 마우스 올리면 해당 가구 ID 전달
          onMouseLeave={() => onHover(null)}       // 마우스 떼면 초기화
          onClick={() => onAction(btn.id)}
        >
          [{btn.label}]
        </button>
      ))}
    </div>
  );
};

export default ActionButtons;