import React, { useState, useRef } from 'react';
import { STOCK_INFO, SECTOR_MAP } from '../../data/stockData'; // 💡 새로 만든 주식 백과사전 불러오기

// 💡 [수정] props에 localHoldings 추가 수신 (장바구니 수량 실시간 표시용)
const StockList = ({ stocks, selectedStock, onSelectStock, localHoldings }) => {
  const [filter, setFilter] = useState('전체');
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // 💡 1. 탭(버튼) 동적 생성을 위해 현재 주식 목록에 존재하는 고유 '섹터 ID'들만 뽑아냅니다.
  const availableSectorIds = [...new Set((stocks || []).map(s => STOCK_INFO[s.stockId]?.sectorId).filter(Boolean))].sort((a,b)=>a-b);

  // 💡 2. 필터링 로직: 선택된 탭이 '전체'가 아니면, 해당 섹터의 주식만 남깁니다.
  const filteredStocks = (stocks || []).filter(stock => {
    if (filter === '전체') return true;
    const sectorId = STOCK_INFO[stock.stockId]?.sectorId;
    return SECTOR_MAP[sectorId] === filter; // 선택한 필터(예: 'MOBILITY (모빌리티)')와 일치하는지 확인
  });

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
          onClick={() => setFilter('전체')}
          style={{
            padding: '6px 12px', fontWeight: 'bold', fontSize: '13px',
            backgroundColor: filter === '전체' ? '#e94560' : '#333', color: '#fff',
            border: filter === '전체' ? '2px solid #fff' : '2px solid #555', borderRadius: '4px',
            cursor: 'pointer', pointerEvents: isDragging ? 'none' : 'auto',
            transition: 'all 0.2s'
          }}
        >
          전체
        </button>
        
        {/* 💡 3. 백과사전을 바탕으로 섹터별 탭 버튼을 그려줍니다. */}
        {availableSectorIds.map(sectorId => {
          const fullSectorName = SECTOR_MAP[sectorId]; // 예: "MOBILITY (모빌리티)"
          // 탭 버튼에는 공간 차지를 줄이기 위해 괄호 안의 한글 이름만 추출하여 표시 (예: "모빌리티")
          const shortName = fullSectorName.includes('(') ? fullSectorName.split('(')[1].replace(')', '') : fullSectorName;
          
          return (
            <button 
              key={sectorId}
              onClick={() => setFilter(fullSectorName)}
              style={{
                padding: '6px 12px', fontWeight: 'bold', fontSize: '13px',
                backgroundColor: filter === fullSectorName ? '#e94560' : '#333', color: '#fff',
                border: filter === fullSectorName ? '2px solid #fff' : '2px solid #555', borderRadius: '4px',
                cursor: 'pointer', pointerEvents: isDragging ? 'none' : 'auto',
                transition: 'all 0.2s'
              }}
            >
              {shortName}
            </button>
          );
        })}
      </div>

      {/* 주식 리스트 본문 */}
      <div className="retro-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {filteredStocks.map(stock => {
          const sId = stock.stockId; 
          
          // 💡 [핵심] 백엔드에서 '종목 4' 같이 오거나 이름이 아예 없으면 프론트의 백과사전으로 강제 변환!
          let sName = stock.company;
          if (!sName || sName.includes('종목')) {
            sName = STOCK_INFO[sId]?.name || `종목 ${sId}`;
          }

          const currentPrice = stock.currentPrice; 
          
          // 💡 [수정] 모달에서 계산된 장바구니 수량(localHoldings)을 최우선으로 보여줍니다!
          const quantity = localHoldings ? (localHoldings.find(h => h.stockId === sId)?.qty || 0) : (stock.myQuantity || 0);
          
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