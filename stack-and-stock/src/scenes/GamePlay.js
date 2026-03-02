import React, { useState } from 'react';
import StatusBar from '../components/StatusBar';
import ActionButtons from '../components/ActionButtons';
import StockModal from '../components/StockModal';
import NewsModal from '../components/NewsModal'; // 추가

const GamePlay = ({ data, onAction, onGoMain }) => {
  const [hoveredObject, setHoveredObject] = useState(null);
  const [isStockOpen, setIsStockOpen] = useState(false);
  const [isNewsOpen, setIsNewsOpen] = useState(false); // 뉴스창 상태 추가

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: data.period === 'MORNING' ? '#4A90E2' : '#1A2A6C', position: 'relative' }}>
      <StatusBar data={data} />

      {/* 중앙 가구 배치 영역 */}
      <div style={{ height: '450px', position: 'relative', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <div style={{ border: hoveredObject === 'COMPUTER' ? '4px solid yellow' : 'none', color: 'white' }}>COMPUTER</div>
        <div style={{ border: hoveredObject === 'NEWSPAPER' ? '4px solid yellow' : 'none', color: 'white' }}>NEWSPAPER</div>
        <div style={{ border: hoveredObject === 'BED' ? '4px solid yellow' : 'none', color: 'white' }}>BED</div>
      </div>

      {/* 하단 영역 */}
      <div style={{ height: '210px', backgroundColor: 'rgba(0,0,0,0.9)', borderTop: '4px solid #fff', display: 'flex', padding: '20px', alignItems: 'center' }}>
        <div style={{ flex: 1, color: '#fff', fontSize: '22px', paddingLeft: '40px' }}>
          <p>{isNewsOpen ? "신문을 읽는 중입니다..." : "오늘은 무엇을 할까?"}</p>
        </div>

        <div style={{ flex: 1 }}>
          <ActionButtons 
            period={data.period} 
            onHover={setHoveredObject} 
            onAction={(id) => {
              if (id === 'NEXT') onAction();
              if (id === 'INVEST') setIsStockOpen(true);
              if (id === 'NEWS') setIsNewsOpen(true); // 신문 보기 클릭 시
            }}
          />
        </div>
      </div>

      {/* 모달 레이어들 */}
      <StockModal isOpen={isStockOpen} onClose={() => setIsStockOpen(false)} money={data.money} onBuy={() => {}} />
      <NewsModal isOpen={isNewsOpen} onClose={() => setIsNewsOpen(false)} day={data.day} />
    </div>
  );
};

export default GamePlay;