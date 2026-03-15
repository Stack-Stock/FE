import React from 'react';

const StockChart = ({ stock, day }) => {
  if (!stock) return <div style={{ height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#888' }}>종목을 선택해주세요.</div>;

  const history = stock.history.slice(0, day);
  const currentPrice = history[history.length - 1];
  const previousPrice = history.length > 1 ? history[history.length - 2] : currentPrice;
  
  const changeAmount = currentPrice - previousPrice;
  const changeRate = ((changeAmount / previousPrice) * 100).toFixed(2);
  const isUp = changeAmount >= 0;
  const mainColor = isUp ? '#ff4b4b' : '#4b4bff'; 

  // 캔들스틱 차트용 가상 OHLC(시/고/저/종가) 생성
  const candles = history.map((price, i) => {
    const open = i === 0 ? price : history[i - 1]; 
    const close = price;
    const diff = Math.abs(close - open);
    const noise = currentPrice * 0.02 * Math.random(); 
    const high = Math.max(open, close) + noise + (diff * Math.random());
    const low = Math.min(open, close) - noise - (diff * Math.random());
    return { open, high, low, close };
  });

  const svgWidth = 600;
  const svgHeight = 120; 
  const paddingY = 15;
  
  // 💡 [핵심] 캔들 너비와 간격을 픽셀 단위로 고정합니다.
  const candleWidth = 10; // 캔들 몸통의 고정 두께
  const candleGap = 6;    // 캔들 사이의 간격
  const step = candleWidth + candleGap;
  const paddingRight = 30; // 우측 여백

  const allPrices = candles.flatMap(c => [c.high, c.low]);
  const minPrice = Math.min(...allPrices) * 0.98; 
  const maxPrice = Math.max(...allPrices) * 1.02; 
  const range = maxPrice - minPrice || 1;

  const getY = (val) => svgHeight - paddingY - ((val - minPrice) / range) * (svgHeight - paddingY * 2);
  
  // 현재가(마지막 종가)의 Y 좌표
  const currentY = getY(currentPrice);

  return (
    <div style={{ backgroundColor: '#111', border: '3px solid #2f3640', borderRadius: '8px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      
      {/* 종목 정보 */}
      <div>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>{stock.name} <span style={{ fontSize: '13px', color: '#888' }}>{stock.code}</span></div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '2px' }}>
          <span style={{ fontSize: '26px', fontWeight: 'bold', color: '#fff' }}>₩{currentPrice.toLocaleString()}</span>
          <span style={{ fontSize: '15px', color: mainColor, fontWeight: 'bold' }}>
            {changeAmount > 0 ? '▲' : changeAmount < 0 ? '▼' : '-'} {Math.abs(changeAmount).toLocaleString()} ({changeRate}%)
          </span>
        </div>
      </div>

      {/* 레트로 캔들스틱 차트 (우측 정렬 고정 너비) */}
      <div style={{ width: '100%', height: `${svgHeight}px`, position: 'relative', backgroundColor: '#0a0a0a', border: '2px solid #222', overflow: 'hidden' }}>
        {/* 모눈종이 배경 */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'linear-gradient(#222 1px, transparent 1px), linear-gradient(90deg, #222 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.5 }} />
        
        <svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0 }}>
          
          {/* 💡 [신규] 현재가 기준 가이드 점선 (빈 공간을 가로지름) */}
          <line 
            x1="0" 
            y1={currentY} 
            x2={svgWidth - paddingRight} 
            y2={currentY} 
            stroke={mainColor} 
            strokeWidth="1" 
            strokeDasharray="4 4" 
            opacity="0.6"
          />

          {/* 💡 [신규] 점선 위에 표시되는 현재가 텍스트 */}
          <text 
            x="10" 
            y={currentY - 6} 
            fill={mainColor} 
            fontSize="11" 
            fontWeight="bold"
            fontFamily="monospace"
            style={{ textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000' }} // 글씨가 잘 보이도록 검은 테두리
          >
            ₩{currentPrice.toLocaleString()}
          </text>

          {candles.map((c, i) => {
            const isCandleUp = c.close >= c.open;
            const color = isCandleUp ? '#ff4b4b' : '#4b4bff';
            
            // 💡 [핵심] 마지막 캔들을 우측 끝으로 고정하고, 거꾸로 X 좌표를 계산하여 우측 정렬
            const distanceFromLast = candles.length - 1 - i;
            const x = svgWidth - paddingRight - (distanceFromLast * step);
            
            // 캔들이 왼쪽 화면 밖으로 넘어가면 그리지 않음
            if (x < -20) return null;
            
            const highY = getY(c.high);
            const lowY = getY(c.low);
            const openY = getY(c.open);
            const closeY = getY(c.close);
            
            const bodyTopY = Math.min(openY, closeY);
            const bodyHeight = Math.max(Math.abs(openY - closeY), 2); 

            return (
              <g key={i} className="pixel-chart-line">
                {/* 꼬리 (고가-저가) */}
                <line x1={x} x2={x} y1={highY} y2={lowY} stroke={color} strokeWidth={2} />
                {/* 몸통 (시가-종가) */}
                <rect x={x - candleWidth/2} y={bodyTopY} width={candleWidth} height={bodyHeight} fill={color} />
              </g>
            );
          })}
        </svg>
      </div>
      
    </div>
  );
};

export default StockChart;