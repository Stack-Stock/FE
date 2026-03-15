import React, { useState, useEffect } from 'react';

const StockTradePanel = ({ stock, day, localMoney, localHoldings, onTrade }) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => { setQuantity(1); }, [stock]);

  if (!stock) return <div style={{ flex: 1, backgroundColor: '#1a1a2e', border: '3px solid #2f3640', borderRadius: '8px' }} />;

  const currentPrice = stock.history[day - 1];
  const totalAmount = currentPrice * quantity;
  const holdingCount = localHoldings[stock.id] || 0;

  const handleBuy = () => {
    if (quantity <= 0) return;
    if (localMoney < totalAmount) { alert("예수금이 부족합니다!"); return; }
    onTrade(stock.id, quantity, currentPrice, 'BUY');
  };

  const handleSell = () => {
    if (quantity <= 0) return;
    if (holdingCount < quantity) { alert("보유 주식이 부족합니다!"); return; }
    onTrade(stock.id, quantity, currentPrice, 'SELL');
  };

  const btnStyle = { width: '30px', height: '30px', backgroundColor: '#333', color: '#fff', border: '2px solid #555', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' };

  return (
    // 💡 [수정] 패딩을 20px -> 15px로 줄여 공간 확보
    <div style={{ flex: 1, backgroundColor: '#1a1a2e', border: '3px solid #2f3640', borderRadius: '8px', padding: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      
      <div>
        <div style={{ color: '#aaa', marginBottom: '8px', fontSize: '13px' }}>거래 수량 (보유: {holdingCount}주)</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button style={btnStyle} onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
          <input 
            type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            style={{ flex: 1, height: '35px', backgroundColor: '#111', color: '#fff', border: '2px solid #444', textAlign: 'center', fontSize: '16px', outline: 'none' }}
          />
          <button style={btnStyle} onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>
      </div>

      {/* 💡 [수정] 마진과 패딩 축소 */}
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

      {/* 💡 [수정] 하단 버튼 패딩 축소하여 화면 잘림 방지 */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={handleBuy}
          style={{ flex: 1, padding: '12px', backgroundColor: '#e94560', color: '#fff', border: '3px solid #c0392b', borderRadius: '6px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          매수 (BUY)
        </button>
        <button 
          onClick={handleSell}
          style={{ flex: 1, padding: '12px', backgroundColor: '#2980b9', color: '#fff', border: '3px solid #2471a3', borderRadius: '6px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          매도 (SELL)
        </button>
      </div>

    </div>
  );
};

export default StockTradePanel;