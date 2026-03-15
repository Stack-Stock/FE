import React from 'react';

const RoomAssets = ({ config, period, hoveredObject, onHover, onInteract }) => {
  const publicPath = process.env.PUBLIC_URL;

  const DEFAULT_OUTLINE_COLOR = '#000000'; 
  const DEFAULT_OUTLINE_THICKNESS = 2;     
  const HOVER_OUTLINE_COLOR = '#FFD700';   
  const HOVER_OUTLINE_THICKNESS = 4;       

  // 💡 [핵심] 상호작용(클릭/호버)이 가능한 에셋들의 목록만 정의합니다.
  // 이 목록에 없는 DESK(책상)와 WINDOW(창문)는 단순 배경 요소로 취급됩니다.
  const INTERACTIVE_ASSETS = ['LAPTOP', 'BED', 'PHONE', 'NEWSPAPER', 'TV'];

  const getOutlineFilter = (color, thickness) => {
    const t = thickness;
    const c = color;
    return `
      drop-shadow(${t}px 0px 0px ${c}) 
      drop-shadow(-${t}px 0px 0px ${c}) 
      drop-shadow(0px ${t}px 0px ${c}) 
      drop-shadow(0px -${t}px 0px ${c})
    `;
  };

  const getZIndex = (id) => {
    if (id === 'WINDOW') return 10; 
    if (id === 'TV') return 20; 
    if (id === 'DESK') return 30;
    if (id === 'BED') return 35;
    if (id === 'PHONE' || id === 'LAPTOP' || id === 'NEWSPAPER') return 40; 
    return 0;
  };

  return (
    <>
      {Object.keys(config).map((id) => {
        const item = config[id];
        const imgUrl = `${publicPath}/assets/objects/${id.toLowerCase()}_${period}.png`;
        
        // 💡 이 에셋이 상호작용 가능한지 확인
        const isInteractive = INTERACTIVE_ASSETS.includes(id);
        
        // 💡 상호작용 가능한 에셋이면서, 현재 마우스가 올라가 있을 때만 호버 상태로 인정
        const isHovered = isInteractive && hoveredObject === id;
        
        const currentFilter = isHovered 
          ? getOutlineFilter(HOVER_OUTLINE_COLOR, HOVER_OUTLINE_THICKNESS)
          : getOutlineFilter(DEFAULT_OUTLINE_COLOR, DEFAULT_OUTLINE_THICKNESS);

        const renderedWidth = item.w * (item.scale / 100);
        const renderedHeight = item.h * (item.scale / 100);

        return (
          <div
            key={id}
            // 💡 상호작용 가능한 에셋만 이벤트(호버, 클릭)를 발생시킵니다.
            onMouseEnter={() => { if (isInteractive) onHover(id); }}
            onMouseLeave={() => { if (isInteractive) onHover(null); }}
            onClick={() => { if (isInteractive) onInteract(id); }}
            style={{
              position: 'absolute',
              left: `${item.x}px`,
              top: `${item.y}px`,
              width: `${renderedWidth}px`,
              height: `${renderedHeight}px`,
              backgroundImage: `url(${imgUrl})`,
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
              imageRendering: 'pixelated',
              
              // 💡 상호작용 가능 여부에 따라 마우스 커서 모양을 다르게 설정합니다.
              cursor: isInteractive ? 'pointer' : 'default',
              
              zIndex: getZIndex(id), 
              filter: currentFilter,
              transition: 'filter 0.1s ease-in-out'
            }}
          />
        );
      })}
    </>
  );
};

export default RoomAssets;