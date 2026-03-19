import React, { useState, useRef } from 'react';

const StockList = ({ stocks, selectedStock, onSelectStock }) => {
  const [filter, setFilter] = useState('전체');
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // 현재 백엔드 응답에 'industry' 필드가 없으므로 '전체'만 노출합니다.
  const filteredStocks = stocks || [];

  const onDragStart = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const onDragEnd = () => setIsDragging(false);
  const onDragMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  if (!stocks || stocks.length === 0) {
    return <div style={{ color: '#fff', padding: '20px', textAlign: 'center' }}>주식 데이터를 불러오는 중이거나 데이터가 없습니다.</div>;
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#1a1a2e', border: '3px solid #2f3640', borderRadius: '8px', overflow: 'hidden' }}>
      
      {/* 탭 영역 */}
      <div 
        ref={scrollRef}
        className="hide-scrollbar" 
        onMouseDown={onDragStart} onMouseLeave={onDragEnd} onMouseUp={onDragEnd} onMouseMove={onDragMove}
        style={{ 
          display: 'flex', gap: '6px', padding: '10px', backgroundColor: '#111', 
          overflowX: 'auto', whiteSpace: 'nowrap', borderBottom: '3px solid #2f3640',
          cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none'
        }}
      >
        <button 
          style={{
            padding: '6px 12px', fontWeight: 'bold', fontSize: '13px',
            backgroundColor: '#e94560', color: '#fff',
            border: '2px solid #fff', borderRadius: '4px',
            cursor: 'pointer', pointerEvents: isDragging ? 'none' : 'auto'
          }}
        >
          전체
        </button>
      </div>

      {/* 주식 리스트 본문 */}
      <div className="retro-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {filteredStocks.map(stock => {
          
          // 💡 [핵심] 보내주신 JSON 응답 형태와 100% 일치하는 매핑!
          const sId = stock.stockId;                   // "stockId": 1
          const sName = stock.company;                 // "company": "삼성전자"
          const currentPrice = stock.currentPrice;     // "currentPrice": 72000
          const quantity = stock.myQuantity;           // "myQuantity": 10
          
          // "returnPct": 0.0125 -> 화면에는 1.25% 로 표시
          const changeRate = (stock.returnPct * 100) || 0; 
          const isUp = changeRate >= 0;

          return (
            <div 
              key={sId} 
              className={`stock-list-item ${selectedStock?.stockId === sId ? 'selected' : ''}`}
              onClick={() => onSelectStock(stock)}
              style={{ 
                padding: '10px', 
                backgroundColor: selectedStock?.stockId === sId ? '#2c3e50' : '#222', 
                border: selectedStock?.stockId === sId ? '2px solid #fff' : '2px solid #444', 
                borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '15px' }}>{sName}</span>
                {quantity > 0 && (
                  <span style={{ backgroundColor: '#2e86de', color: '#fff', fontSize: '11px', padding: '2px 5px', borderRadius: '4px', fontWeight: 'bold' }}>
                    {quantity}주
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#ccc', fontSize: '13px' }}>₩{currentPrice.toLocaleString()}</span>
                <span style={{ color: isUp ? '#ff4b4b' : '#4b4bff', fontSize: '13px', fontWeight: 'bold' }}>
                  {isUp ? '▲' : '▼'} {Math.abs(changeRate).toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StockList;