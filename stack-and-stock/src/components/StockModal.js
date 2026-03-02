import React from 'react';
import { motion } from 'framer-motion';

const StockModal = ({ isOpen, onClose, money, onBuy }) => {
  if (!isOpen) return null;

  // 더미 주식 리스트
  const stockList = [
    { id: 1, name: "삼성전자(SAMSUNG)", price: 72000, change: "+2.5%" },
    { id: 2, name: "네이버(NAVER)", price: 185000, change: "-1.2%" },
    { id: 3, name: "에스에스에이피와이(SSAFY)", price: 50000, change: "+15.0%" },
  ];

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', 
      alignItems: 'center', zIndex: 1000
    }}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          width: '600px', background: '#222', border: '4px solid #fff',
          padding: '30px', color: '#fff'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ color: '#FFD700' }}>[STOCK MARKET]</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '20px' }}>X</button>
        </div>

        <div style={{ marginBottom: '20px', borderBottom: '2px solid #444', paddingBottom: '10px' }}>
          현재 예수금: <span style={{ color: '#32CD32' }}>{money.toLocaleString()}원</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {stockList.map(stock => (
            <div key={stock.id} style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '15px', border: '2px solid #555', background: '#333'
            }}>
              <div>
                <div style={{ fontSize: '18px' }}>{stock.name}</div>
                <div style={{ color: stock.change.startsWith('+') ? '#ff4b4b' : '#4b4bff' }}>
                  {stock.price.toLocaleString()}원 ({stock.change})
                </div>
              </div>
              <button 
                className="pixel-btn" 
                style={{ padding: '8px 16px', fontSize: '14px' }}
                onClick={() => onBuy(stock)}
              >
                매수하기
              </button>
            </div>
          ))}
        </div>

        <p style={{ marginTop: '20px', fontSize: '14px', color: '#888', textAlign: 'center' }}>
          * 주식 가격은 매일 아침 업데이트됩니다.
        </p>
      </motion.div>
    </div>
  );
};

export default StockModal;