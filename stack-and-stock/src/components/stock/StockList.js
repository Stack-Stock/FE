import React, { useState, useRef } from 'react';
import { INDUSTRIES, STOCK_LIST } from '../../data/dummyStockData';

const StockList = ({ day, selectedStock, onSelectStock, localHoldings }) => {
  const [filter, setFilter] = useState('전체');
  
  // 💡 [신규] 드래그 스크롤을 위한 상태 및 Ref
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const filteredStocks = filter === '전체' ? STOCK_LIST : STOCK_LIST.filter(s => s.industry === filter);

  // 💡 [신규] 마우스 드래그 이벤트 핸들러
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
    const walk = (x - startX) * 1.5; // 스크롤 속도
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#1a1a2e', border: '3px solid #2f3640', borderRadius: '8px', overflow: 'hidden' }}>
      
      {/* 💡 [수정] 드래그 이벤트가 적용된 필터 탭 */}
      <div 
        ref={scrollRef}
        className="hide-scrollbar" 
        onMouseDown={onDragStart}
        onMouseLeave={onDragEnd}
        onMouseUp={onDragEnd}
        onMouseMove={onDragMove}
        style={{ 
          display: 'flex', gap: '6px', padding: '10px', backgroundColor: '#111', 
          overflowX: 'auto', whiteSpace: 'nowrap', borderBottom: '3px solid #2f3640',
          cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none' // 꾹 누를 때 커서 모양 변경
        }}
      >
        {INDUSTRIES.map(ind => (
          <button
            key={ind}
            onClick={() => setFilter(ind)}
            style={{
              padding: '6px 12px', fontWeight: 'bold', fontSize: '13px',
              backgroundColor: filter === ind ? '#e94560' : '#222', color: filter === ind ? '#fff' : '#aaa',
              border: filter === ind ? '2px solid #fff' : '2px solid #444', borderRadius: '4px',
              cursor: 'pointer', pointerEvents: isDragging ? 'none' : 'auto' // 드래그 중엔 클릭 방지
            }}
          >
            {ind}
          </button>
        ))}
      </div>

      {/* 주식 리스트 */}
      <div className="retro-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {filteredStocks.map(stock => {
          const history = stock.history.slice(0, day);
          const currentPrice = history[history.length - 1];
          const previousPrice = history.length > 1 ? history[history.length - 2] : currentPrice;
          const changeRate = (((currentPrice - previousPrice) / previousPrice) * 100).toFixed(2);
          const isUp = currentPrice >= previousPrice;
          const holdings = localHoldings[stock.id]?.quantity || 0;

          return (
            <div 
              key={stock.id} 
              className={`stock-list-item ${selectedStock?.id === stock.id ? 'selected' : ''}`}
              onClick={() => onSelectStock(stock)}
              style={{ padding: '10px', backgroundColor: '#222', border: '2px solid #444', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '15px' }}>{stock.name}</span>
                {holdings > 0 && <span style={{ backgroundColor: '#2e86de', color: '#fff', fontSize: '11px', padding: '2px 5px', borderRadius: '4px' }}>{holdings}주</span>}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#ccc', fontSize: '13px' }}>₩{currentPrice.toLocaleString()}</span>
                <span style={{ color: isUp ? '#ff4b4b' : '#4b4bff', fontSize: '13px', fontWeight: 'bold' }}>
                  {isUp ? '▲' : '▼'} {Math.abs(changeRate)}%
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