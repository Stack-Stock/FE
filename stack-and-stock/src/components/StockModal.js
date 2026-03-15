import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/StockModal.css'; 
import { STOCK_LIST } from '../data/dummyStockData';
import StockList from './stock/StockList';
import StockChart from './stock/StockChart';
import StockTradePanel from './stock/StockTradePanel';

// 💡 [수정] isTradedToday props 추가
const StockModal = ({ isOpen, onClose, day, money, holdings = {}, onConfirmTrade, isTradedToday }) => {
  const [localMoney, setLocalMoney] = useState(money);
  const [localHoldings, setLocalHoldings] = useState(holdings);
  const [selectedStock, setSelectedStock] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setLocalMoney(money);
      setLocalHoldings(holdings);
      setSelectedStock(STOCK_LIST[0]); 
    }
  }, [isOpen, money, holdings]);

  if (!isOpen) return null;

  const handleTrade = (stockId, quantity, price, type) => {
    const totalAmount = price * quantity;
    const currentHolding = localHoldings[stockId] || 0;

    if (type === 'BUY') {
      setLocalMoney(prev => prev - totalAmount);
      setLocalHoldings(prev => ({ ...prev, [stockId]: currentHolding + quantity }));
    } else if (type === 'SELL') {
      setLocalMoney(prev => prev + totalAmount);
      setLocalHoldings(prev => ({ ...prev, [stockId]: currentHolding - quantity }));
    }
  };

  const handleConfirm = () => {
    // 오늘 이미 거래했다면 무시
    if (isTradedToday) return;
    const tradeData = { finalMoney: localMoney, finalHoldings: localHoldings };
    onConfirmTrade(tradeData); 
  };

  const stockValue = Object.entries(localHoldings).reduce((acc, [id, qty]) => {
    const stock = STOCK_LIST.find(s => s.id === Number(id));
    if (!stock) return acc;
    const currentPrice = stock.history[day - 1];
    return acc + (currentPrice * qty);
  }, 0);

  const totalAssets = localMoney + stockValue;

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 }}>
      <motion.div 
        initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        style={{ width: '1000px', height: '650px', background: '#12121c', border: '6px solid #4a69bd', borderRadius: '15px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.8)' }}
      >
        <div style={{ height: '80px', backgroundColor: '#1e3799', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 25px', borderBottom: '4px solid #4a69bd' }}>
          
          <div style={{ display: 'flex', gap: '40px', color: '#fff' }}>
            {/* ... 상단 정보 3종 유지 ... */}
            <div><div style={{ fontSize: '13px', color: '#d1d8e0' }}>보유 현금</div><div style={{ fontSize: '22px', fontWeight: 'bold' }}>₩{localMoney.toLocaleString()}</div></div>
            <div><div style={{ fontSize: '13px', color: '#d1d8e0' }}>주식 평가금</div><div style={{ fontSize: '22px', fontWeight: 'bold' }}>₩{stockValue.toLocaleString()}</div></div>
            <div><div style={{ fontSize: '13px', color: '#FFD700' }}>총 자산</div><div style={{ fontSize: '22px', fontWeight: 'bold', color: '#FFD700' }}>₩{totalAssets.toLocaleString()}</div></div>
          </div>
          
          <div style={{ display: 'flex', gap: '15px' }}>
            {/* 💡 [핵심] isTradedToday 상태에 따라 버튼 디자인과 활성화 여부를 완전히 다르게 줍니다. */}
            <button 
              onClick={handleConfirm} 
              disabled={isTradedToday}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: isTradedToday ? '#555' : '#fa983a', 
                color: isTradedToday ? '#999' : '#fff', 
                border: isTradedToday ? '3px solid #333' : '3px solid #e55039', 
                borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', 
                cursor: isTradedToday ? 'not-allowed' : 'pointer', 
                boxShadow: isTradedToday ? 'none' : '2px 2px 0 #000',
                textDecoration: isTradedToday ? 'line-through' : 'none'
              }}
            >
              {isTradedToday ? '[금일 거래 마감]' : '[거래 확정 및 종료]'}
            </button>
            <button onClick={onClose} style={{ padding: '8px 15px', backgroundColor: '#333', color: '#fff', border: '3px solid #555', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
              X
            </button>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', padding: '12px', gap: '12px', height: 'calc(100% - 80px)' }}>
          <div style={{ flex: '1 1 30%', display: 'flex', minWidth: '250px' }}>
            <StockList day={day} selectedStock={selectedStock} onSelectStock={setSelectedStock} localHoldings={localHoldings} />
          </div>
          <div style={{ flex: '1 1 70%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <StockChart stock={selectedStock} day={day} />
            {/* 💡 우측 패널로도 isTradedToday를 넘겨줍니다. */}
            <StockTradePanel stock={selectedStock} day={day} localMoney={localMoney} localHoldings={localHoldings} onTrade={handleTrade} isTradedToday={isTradedToday} />
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default StockModal;