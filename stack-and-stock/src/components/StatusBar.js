import React from 'react';
import useGameStore from '../store/useGameStore'; // 💡 스토어 임포트

const StatusBar = () => {
  // 💡 [핵심] 스토어에서 직접 필요한 데이터를 빼옵니다.
  const { day, period, money, energy, getTotalAssets } = useGameStore();

  const maxEnergy = 3;
  const energyBlocks = Array.from({ length: maxEnergy }, (_, i) => i < energy);

  // 스토어 내부 함수를 이용해 총 자산을 구함 (계산 로직 중복 제거!)
  const totalAssets = getTotalAssets();

  return (
    <div style={{
      width: '100%', height: '50px', backgroundColor: '#2b2b2b', borderBottom: '4px solid #000',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      color: '#fff', padding: '0 20px', boxSizing: 'border-box', zIndex: 100, fontSize: '20px'
    }}>
      <div style={{ backgroundColor: '#fff', color: '#000', padding: '2px 10px', fontWeight: 'bold', border: '2px solid #000' }}>
        DAY {day} ({period === 'MORNING' ? '아침' : '저녁'})
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ color: '#FFD700', fontWeight: 'bold' }}>[COIN]</span>
        <span>현금: {money.toLocaleString()}원</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ color: '#00BFFF', fontWeight: 'bold' }}>[BOLT]</span>
        <span>행동력:</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {energyBlocks.map((isFull, index) => (
            <div key={index} style={{ width: '18px', height: '18px', backgroundColor: isFull ? '#FFD700' : '#444', border: '2px solid #000' }} />
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ color: '#32CD32', fontWeight: 'bold' }}>[CHART]</span>
        <span>총 자산: {totalAssets.toLocaleString()}원</span>
      </div>
    </div>
  );
};

export default StatusBar;