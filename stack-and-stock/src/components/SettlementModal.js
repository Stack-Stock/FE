import React from 'react';
import { motion } from 'framer-motion';

// 💡 [수정] money, holdings 대신 백엔드에서 받을 settlementData를 props로 받습니다.
const SettlementModal = ({ isOpen, onClose, day, settlementData }) => {
  if (!isOpen) return null;

  // 안전망: 데이터가 없을 경우를 대비해 기본값 0 설정
  const { 
    totalChange = 0, 
    cashChange = 0, 
    stockChange = 0 
  } = settlementData || {};

  // 💡 등락에 따른 색상 및 기호 결정 함수
  const formatChange = (amount) => {
    if (amount > 0) return { text: `+₩${amount.toLocaleString()}`, color: '#2ecc71' }; // 상승 (초록)
    if (amount < 0) return { text: `-₩${Math.abs(amount).toLocaleString()}`, color: '#4b4bff' }; // 하락 (파랑)
    return { text: `+₩0`, color: '#a4b0be' }; // 변동 없음 (회색)
  };

  const totalFormatted = formatChange(totalChange);
  const cashFormatted = formatChange(cashChange);
  const stockFormatted = formatChange(stockChange);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1200 }}>
      <motion.div 
        initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        style={{ width: '600px', background: '#12121c', border: '4px solid #4a69bd', borderRadius: '12px', padding: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.8)' }}
      >
        {/* 상단 타이틀 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #2f3640', paddingBottom: '15px', marginBottom: '25px' }}>
          <div>
            <h2 style={{ color: '#fff', fontSize: '28px', margin: '0 0 5px 0' }}>Day {day > 1 ? day - 1 : day} 결산 내역</h2>
            <p style={{ color: '#a4b0be', margin: 0, fontSize: '14px' }}>간밤의 자산 변동을 확인하세요.</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
        </div>

        {/* 총 자산 변동 (가장 크게) */}
        <div style={{ backgroundColor: '#1e2749', border: '2px solid #4a69bd', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
          <div style={{ color: '#d1d8e0', fontSize: '14px', marginBottom: '8px' }}>총 자산 변동</div>
          <div style={{ color: totalFormatted.color, fontSize: '36px', fontWeight: 'bold' }}>
            {totalFormatted.text}
          </div>
        </div>

        {/* 현금 및 주식 변동 (2단 분할) */}
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1, backgroundColor: '#1a1a2e', border: '2px solid #2f3640', borderRadius: '8px', padding: '20px' }}>
            <div style={{ color: '#a4b0be', fontSize: '14px', marginBottom: '8px' }}>현금 변동</div>
            <div style={{ color: cashFormatted.color, fontSize: '24px', fontWeight: 'bold' }}>
              {cashFormatted.text}
            </div>
          </div>
          <div style={{ flex: 1, backgroundColor: '#1a1a2e', border: '2px solid #2f3640', borderRadius: '8px', padding: '20px' }}>
            <div style={{ color: '#a4b0be', fontSize: '14px', marginBottom: '8px' }}>주식 평가금 변동</div>
            <div style={{ color: stockFormatted.color, fontSize: '24px', fontWeight: 'bold' }}>
              {stockFormatted.text}
            </div>
          </div>
        </div>

        {/* 닫기 버튼 */}
        <button 
          onClick={onClose} 
          style={{ width: '100%', padding: '15px', marginTop: '25px', backgroundColor: '#3c6382', color: '#fff', border: '2px solid #0a3d62', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          확인
        </button>

      </motion.div>
    </div>
  );
};

export default SettlementModal;