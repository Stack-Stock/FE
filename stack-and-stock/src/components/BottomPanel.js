import React from 'react';
import ActionButtons from './ActionButtons';

// 💡 [핵심] hoveredObject를 props로 받아옵니다.
const BottomPanel = ({ data, hoveredObject, isNewsOpen, onHover, onAction, onNewsClick }) => {
  const day = data?.day || 10;
  const period = data?.period || 'MORNING';

  const getPanelText = () => {
    if (isNewsOpen) return { title: "신문을 읽는 중입니다...", sub: "" };

    switch (hoveredObject) {
      case 'PHONE': 
        return { title: "sns 찌라시로 정보를 확인해 보세요!", sub: "(소모 행동력 : 0)" };
      case 'NEWSPAPER': 
        return { title: "언론사의 기사로 정보를 확인해 보세요!", sub: "(소모 행동력 : 1)" };
      case 'TV': 
        return { title: "최신 뉴스로 정보를 확인해 보세요!", sub: "(소모 행동력 : 2)" };
      case 'LAPTOP': 
        return { title: "뉴스와 기사에서 얻은 정보로 투자를 진행해 보세요!", sub: "(소모 행동력 : 1)" };
      case 'DESK': 
        return { title: "학생의 본분은 공부! 공부를 너무 안 하면 큰 일이 일어날지도...?", sub: "(소모 행동력 : 1)" };
      case 'BED':
        return period === 'MORNING'
          ? { title: "오늘 하루도 열심히!", sub: "(사용하지 않은 행동력이 없는지 확인해 주세요.)" }
          : { title: "오늘은 이만 쉬어야 겠어요!", sub: "(사용하지 않은 행동력이 없는지 확인해 주세요.)" };
      default:
        return period === 'MORNING'
          ? { title: `${day}일차 아침이 밝았습니다!`, sub: "오늘도 활기찬 하루를 시작해볼까?" }
          : { title: "뉴스와 기사를 보고 투자를 진행해 주세요!", sub: "어제 산 주식이 올랐을까?" };
    }
  };

  const currentText = getPanelText();

  return (
    <div style={{ height: '176px', backgroundColor: '#cd853f', padding: '8px', display: 'flex', gap: '10px' }}>
      
      <div style={{ flex: 1.2, backgroundColor: '#1a1a1a', border: '4px solid #4a3b2c', borderRadius: '8px', padding: '15px', color: '#fff', fontSize: '20px', lineHeight: '1.5' }}>
        <p>{currentText.title}</p>
        <p style={{ color: '#aaa', fontSize: '16px', marginTop: '8px' }}>
          {currentText.sub}
        </p>
      </div>

      <div style={{ flex: 1, backgroundColor: '#cdaa7d', border: '4px solid #4a3b2c', borderRadius: '8px', padding: '8px' }}>
        {/* 💡 [핵심] 전달받은 hoveredObject를 하위 버튼 컴포넌트로 다시 내려줍니다. */}
        <ActionButtons 
          period={period} 
          hoveredObject={hoveredObject} 
          onHover={onHover} 
          onAction={onAction} 
          onNewsClick={onNewsClick} 
        />
      </div>
      
    </div>
  );
};

export default BottomPanel;