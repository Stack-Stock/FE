import React, { useState, useRef } from 'react';

const StockList = ({ stocks, selectedStock, onSelectStock, localHoldings }) => {
  const [filter, setFilter] = useState('전체');
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // 💡 [수정] DB 데이터의 "industry" 필드를 사용하여 산업군 리스트 추출
  const industries = ['전체', ...new Set(stocks.map(s => s.industry || '기타'))];

  // 💡 [수정] "industry" 필드로 필터링
  const filteredStocks = filter === '전체' 
    ? stocks 
    : stocks.filter(s => (s.industry || '기타') === filter);

  // 드래그 스크롤 핸들러
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

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#1a1a2e', border: '3px solid #2f3640', borderRadius: '8px', overflow: 'hidden' }}>
      
      {/* 산업군 필터 탭 (드래그 가능) */}
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
        {industries.map(ind => (
          <button key={ind} onClick={() => setFilter(ind)}
            style={{
              padding: '6px 12px', fontWeight: 'bold', fontSize: '13px',
              backgroundColor: filter === ind ? '#e94560' : '#222', color: filter === ind ? '#fff' : '#aaa',
              border: filter === ind ? '2px solid #fff' : '2px solid #444', borderRadius: '4px',
              cursor: 'pointer', pointerEvents: isDragging ? 'none' : 'auto'
            }}
          >
            {ind}
          </button>
        ))}
      </div>

      {/* 주식 리스트 본문 */}
      <div className="retro-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {filteredStocks.map(stock => {
          // 💡 [핵심] 보내주신 JSON 데이터 필드명으로 정확히 매핑
          const sId = stock.stock_id;        // DB: stock_id
          const sName = stock.company;       // DB: company
          const currentPrice = stock.closePrice || 0; // DB에 포함되어 있어야 함
          
          // DB의 game_return은 소수점 형태(예: -0.0147)이므로 100을 곱해 퍼센트로 표시
          const changeRate = (stock.game_return * 100) || 0;
          const isUp = changeRate >= 0;

          // 현재 보유 수량 확인 (localHoldings 배열에서 매칭되는 stockId 찾기)
          const holding = localHoldings.find(h => h.stockId === sId);
          const quantity = holding?.quantity || 0;

          return (
            <div 
              key={sId} 
              className={`stock-list-item ${selectedStock?.stock_id === sId ? 'selected' : ''}`}
              onClick={() => onSelectStock(stock)}
              style={{ 
                padding: '10px', 
                backgroundColor: selectedStock?.stock_id === sId ? '#2c3e50' : '#222', 
                border: selectedStock?.stock_id === sId ? '2px solid #fff' : '2px solid #444', 
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