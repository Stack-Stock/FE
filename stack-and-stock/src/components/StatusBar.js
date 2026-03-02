import React from 'react';

const StatusBar = ({ data }) => {
  // 행동력을 시각적으로 표현하기 위한 배열 (최대 3칸 기준 예시)
  const maxEnergy = 3;
  const energyBlocks = Array.from({ length: maxEnergy }, (_, i) => i < data.energy);

  return (
    <div style={{
      width: '100%',
      height: '60px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderBottom: '4px solid #444',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      color: '#fff',
      padding: '0 20px',
      boxSizing: 'border-box',
      zIndex: 100
    }}>
      {/* 1. 현금 정보 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ color: '#FFD700', fontWeight: 'bold' }}>[COIN]</span>
        <span>현금: {data.money.toLocaleString()}원</span>
      </div>

      {/* 2. 행동력 (Bolt) 정보 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ color: '#00BFFF', fontWeight: 'bold' }}>[BOLT]</span>
        <span>행동력:</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {energyBlocks.map((isFull, index) => (
            <div
              key={index}
              style={{
                width: '18px',
                height: '18px',
                backgroundColor: isFull ? '#FFD700' : '#444',
                border: '2px solid #fff'
              }}
            />
          ))}
        </div>
      </div>

      {/* 3. 총 자산 정보 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ color: '#32CD32', fontWeight: 'bold' }}>[CHART]</span>
        <span>총 자산: {(data.money + (data.assets || 0)).toLocaleString()}원</span>
      </div>

      {/* 4. 날짜 정보 (추가) */}
      <div style={{ backgroundColor: '#fff', color: '#000', padding: '2px 10px', fontWeight: 'bold' }}>
        DAY {data.day} ({data.period === 'MORNING' ? '아침' : '오후'})
      </div>
    </div>
  );
};

export default StatusBar;