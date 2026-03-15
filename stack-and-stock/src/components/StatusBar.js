import React from 'react';

const StatusBar = ({ data }) => {
  // 행동력을 시각적으로 표현하기 위한 배열
  const maxEnergy = 3;
  const energyBlocks = Array.from({ length: maxEnergy }, (_, i) => i < data.energy);

  return (
    <div style={{
      width: '100%',
      height: '50px',
      backgroundColor: '#2b2b2b',
      borderBottom: '4px solid #000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      color: '#fff',
      padding: '0 20px',
      boxSizing: 'border-box',
      zIndex: 100,
      fontSize: '20px'
    }}>
      {/* 1. 날짜 정보 */}
      <div style={{ backgroundColor: '#fff', color: '#000', padding: '2px 10px', fontWeight: 'bold', border: '2px solid #000' }}>
        DAY {data.day} ({data.period === 'MORNING' ? '아침' : '저녁'})
      </div>

      {/* 2. 현금 정보 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ color: '#FFD700', fontWeight: 'bold' }}>[COIN]</span>
        <span>현금: {data.money.toLocaleString()}원</span>
      </div>

      {/* 3. 행동력 (Bolt) 정보 */}
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
                border: '2px solid #000'
              }}
            />
          ))}
        </div>
      </div>

      {/* 4. 총 자산 정보 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ color: '#32CD32', fontWeight: 'bold' }}>[CHART]</span>
        <span>총 자산: {(data.money + (data.assets || 0)).toLocaleString()}원</span>
      </div>
    </div>
  );
};

export default StatusBar;