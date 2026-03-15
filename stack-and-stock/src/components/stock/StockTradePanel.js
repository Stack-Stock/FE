import React, { useState, useEffect } from 'react';

// 💡 [수정] isTradedToday props 추가
const StockTradePanel = ({ stock, day, localMoney, localHoldings, onTrade, isTradedToday }) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => { setQuantity(1); }, [stock]);

  if (!stock) return <div style={{ flex: 1, backgroundColor: '#1a1a2e', border: '3px solid #2f3640', borderRadius: '8px' }} />;

  const currentPrice = stock.history[day - 1];
  const totalAmount = currentPrice * quantity;
  const holdingCount = localHoldings[stock.id]?.quantity || 0;

  const handleBuy = () => {
    if (isTradedToday) return; // 오늘 거래했으면 컷
    if (quantity <= 0) return;
    if (localMoney < totalAmount) { alert("예수금이 부족합니다!"); return; }
    onTrade(stock.id, quantity, currentPrice, 'BUY');
  };

  const handleSell = () => {
    if (isTradedToday) return; // 오늘 거래했으면 컷
    if (quantity <= 0) return;
    if (holdingCount < quantity) { alert("보유 주식이 부족합니다!"); return; }
    onTrade(stock.id, quantity, currentPrice, 'SELL');
  };

  const btnStyle = { width: '30px', height: '30px', backgroundColor: '#333', color: '#fff', border: '2px solid #555', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' };

  return (
    <div style={{ flex: 1, backgroundColor: '#1a1a2e', border: '3px solid #2f3640', borderRadius: '8px', padding: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      
      <div>
        <div style={{ color: '#aaa', marginBottom: '8px', fontSize: '13px' }}>거래 수량 (보유: {holdingCount}주)</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* 이미 거래를 마쳤으면 수량 조절도 안 되게 막아줍니다 */}
          <button style={btnStyle} disabled={isTradedToday} onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
          <input 
            type="number" value={quantity} disabled={isTradedToday} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            style={{ flex: 1, height: '35px', backgroundColor: '#111', color: isTradedToday ? '#555' : '#fff', border: '2px solid #444', textAlign: 'center', fontSize: '16px', outline: 'none' }}
          />
          <button style={btnStyle} disabled={isTradedToday} onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>
      </div>

      <div style={{ margin: '10px 0', padding: '12px', backgroundColor: '#111', border: '2px solid #222', borderRadius: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: '#aaa', fontSize: '14px' }}>거래 금액</span>
          <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>₩{totalAmount.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#aaa', fontSize: '14px' }}>거래 후 예수금 (매수 시)</span>
          <span style={{ color: localMoney >= totalAmount ? '#2ecc71' : '#e74c3c', fontWeight: 'bold', fontSize: '14px' }}>
            ₩{(localMoney - totalAmount).toLocaleString()}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        {/* 💡 [핵심] isTradedToday일 경우 매수/매도 버튼도 회색으로 죽여버립니다. */}
        <button 
          onClick={handleBuy} disabled={isTradedToday}
          style={{ 
            flex: 1, padding: '12px', 
            backgroundColor: isTradedToday ? '#333' : '#e94560', 
            color: isTradedToday ? '#666' : '#fff', 
            border: isTradedToday ? '3px solid #222' : '3px solid #c0392b', 
            borderRadius: '6px', fontSize: '18px', fontWeight: 'bold', 
            cursor: isTradedToday ? 'not-allowed' : 'pointer' 
          }}
        >
          매수 (BUY)
        </button>
        <button 
          onClick={handleSell} disabled={isTradedToday}
          style={{ 
            flex: 1, padding: '12px', 
            backgroundColor: isTradedToday ? '#333' : '#2980b9', 
            color: isTradedToday ? '#666' : '#fff', 
            border: isTradedToday ? '3px solid #222' : '3px solid #2471a3', 
            borderRadius: '6px', fontSize: '18px', fontWeight: 'bold', 
            cursor: isTradedToday ? 'not-allowed' : 'pointer' 
          }}
        >
          매도 (SELL)
        </button>
      </div>

    </div>
  );
};

export default StockTradePanel;