import React, { useState, useEffect } from 'react';

const StockTradePanel = ({ stock, localMoney, localHoldings, onTrade, isTradedToday }) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => { setQuantity(1); }, [stock]);

  if (!stock) return <div style={{ flex: 1, backgroundColor: '#1a1a2e', border: '3px solid #2f3640', borderRadius: '8px' }} />;

  // 💡 [수정] 백엔드 데이터 closePrice 사용
  const currentPrice = stock.closePrice;
  const totalAmount = currentPrice * quantity;
  
  const holding = localHoldings.find(h => h.stockId === stock.stockId);
  const holdingCount = holding?.quantity || 0;

  const handleBuy = () => {
    if (isTradedToday || quantity <= 0) return;
    if (localMoney < totalAmount) { onTrade(null, null, null, 'ERROR_MONEY'); return; }
    onTrade(stock.stockId, quantity, currentPrice, 'BUY');
  };

  const handleSell = () => {
    if (isTradedToday || quantity <= 0) return;
    if (holdingCount < quantity) { onTrade(null, null, null, 'ERROR_STOCK'); return; }
    onTrade(stock.stockId, quantity, currentPrice, 'SELL');
  };

  const btnStyle = { width: '35px', height: '35px', backgroundColor: '#333', color: '#fff', border: '2px solid #555', cursor: 'pointer', fontSize: '20px', fontWeight: 'bold' };

  return (
    <div style={{ flex: 1, backgroundColor: '#1a1a2e', border: '3px solid #2f3640', borderRadius: '8px', padding: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ color: '#aaa', marginBottom: '8px', fontSize: '13px' }}>거래 수량 (보유: {holdingCount}주)</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button style={btnStyle} disabled={isTradedToday} onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
          <input 
            type="number" value={quantity} disabled={isTradedToday} 
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            style={{ flex: 1, height: '35px', backgroundColor: '#111', color: isTradedToday ? '#555' : '#fff', border: '2px solid #444', textAlign: 'center', fontSize: '16px', outline: 'none' }}
          />
          <button style={btnStyle} disabled={isTradedToday} onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>
      </div>

      <div style={{ margin: '10px 0', padding: '12px', backgroundColor: '#111', border: '2px solid #222', borderRadius: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: '#aaa', fontSize: '14px' }}>거래 총액</span>
          <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>₩{totalAmount.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#aaa', fontSize: '14px' }}>잔액(매수시)</span>
          <span style={{ color: localMoney >= totalAmount ? '#2ecc71' : '#e74c3c', fontWeight: 'bold', fontSize: '14px' }}>
            ₩{(localMoney - totalAmount).toLocaleString()}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={handleBuy} disabled={isTradedToday}
          style={{ flex: 1, padding: '12px', backgroundColor: isTradedToday ? '#333' : '#e94560', color: isTradedToday ? '#666' : '#fff', border: '3px solid #000', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: isTradedToday ? 'not-allowed' : 'pointer' }}>
          매수 (BUY)
        </button>
        <button onClick={handleSell} disabled={isTradedToday}
          style={{ flex: 1, padding: '12px', backgroundColor: isTradedToday ? '#333' : '#2980b9', color: isTradedToday ? '#666' : '#fff', border: '3px solid #000', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: isTradedToday ? 'not-allowed' : 'pointer' }}>
          매도 (SELL)
        </button>
      </div>
    </div>
  );
};

export default StockTradePanel;