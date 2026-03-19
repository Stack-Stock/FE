import React, { useState, useEffect } from 'react';
import useGameStore from '../../store/useGameStore'; 

const StockTradePanel = ({ stock, localMoney, myQuantity, onTrade, isTradedToday }) => {
  const [quantity, setQuantity] = useState(1);
  const { showToast } = useGameStore();

  // 종목이 바뀔 때마다 수량을 1로 초기화
  useEffect(() => { setQuantity(1); }, [stock]);

  if (!stock) return <div style={{ flex: 1, backgroundColor: '#1a1a2e', border: '3px solid #2f3640', borderRadius: '8px' }} />;

  // 💡 [핵심 수정] NaN 에러의 원인이었던 closePrice를 currentPrice로 변경!
  const currentPrice = stock.currentPrice || 0;
  const totalAmount = currentPrice * quantity;
  
  // 💡 최대 구매 가능 수량 (현재 장바구니 반영 예상 잔액 기준)
  const maxBuy = currentPrice > 0 ? Math.floor(localMoney / currentPrice) : 0;
  // 💡 최대 판매 가능 수량 (현재 장바구니 반영 예상 보유 수량)
  const maxSell = myQuantity || 0;

  const handleBuy = () => {
    if (isTradedToday || quantity <= 0) return;
    if (localMoney < totalAmount) { 
      showToast("보유 현금이 부족합니다.", "error"); 
      return; 
    }
    // StockModal의 장바구니에 매수 내역 담기
    onTrade(stock.stockId, quantity, 'BUY');
    setQuantity(1); // 담고 나서 수량 리셋
  };

  const handleSell = () => {
    if (isTradedToday || quantity <= 0) return;
    if (maxSell < quantity) { 
      showToast("보유 주식 수가 부족합니다.", "error"); 
      return; 
    }
    // StockModal의 장바구니에 매도 내역 담기
    onTrade(stock.stockId, quantity, 'SELL');
    setQuantity(1); // 담고 나서 수량 리셋
  };

  // 편의성 버튼
  const setMaxBuy = () => { if (maxBuy > 0) setQuantity(maxBuy); };
  const setMaxSell = () => { if (maxSell > 0) setQuantity(maxSell); };

  const btnStyle = { width: '35px', height: '35px', backgroundColor: '#333', color: '#fff', border: '2px solid #555', cursor: 'pointer', fontSize: '20px', fontWeight: 'bold' };

  return (
    <div style={{ flex: 1, backgroundColor: '#1a1a2e', border: '3px solid #2f3640', borderRadius: '8px', padding: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: '#aaa', fontSize: '13px' }}>거래 수량 (보유: {maxSell}주)</span>
          <div style={{ display: 'flex', gap: '5px' }}>
            <button onClick={setMaxBuy} style={{ fontSize: '11px', padding: '2px 6px', backgroundColor: '#e94560', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>최대매수</button>
            <button onClick={setMaxSell} style={{ fontSize: '11px', padding: '2px 6px', backgroundColor: '#2980b9', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>최대매도</button>
          </div>
        </div>
        
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
          <span style={{ color: '#aaa', fontSize: '14px' }}>예상 잔액 (매수시)</span>
          <span style={{ color: localMoney >= totalAmount ? '#2ecc71' : '#e74c3c', fontWeight: 'bold', fontSize: '14px' }}>
            ₩{(localMoney - totalAmount).toLocaleString()}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={handleBuy} disabled={isTradedToday}
          style={{ flex: 1, padding: '12px', backgroundColor: isTradedToday ? '#333' : '#e94560', color: isTradedToday ? '#666' : '#fff', border: '3px solid #000', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: isTradedToday ? 'not-allowed' : 'pointer' }}>
          장바구니 담기 (BUY)
        </button>
        <button onClick={handleSell} disabled={isTradedToday}
          style={{ flex: 1, padding: '12px', backgroundColor: isTradedToday ? '#333' : '#2980b9', color: isTradedToday ? '#666' : '#fff', border: '3px solid #000', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: isTradedToday ? 'not-allowed' : 'pointer' }}>
          장바구니 담기 (SELL)
        </button>
      </div>
    </div>
  );
};

export default StockTradePanel;