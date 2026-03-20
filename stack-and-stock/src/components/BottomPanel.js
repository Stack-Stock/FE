import React from 'react';
import ActionButtons from './ActionButtons';
import useGameStore from '../store/useGameStore'; // 💡 스토어 직접 호출

const BottomPanel = ({ hoveredObject, onHover, onInteract, isStudiedToday, isTvWatchedToday }) => {
  // 💡 props(data) 대신 스토어에서 직접 가져옵니다!
  const { day, period, isDemoMode } = useGameStore();
  
  // 💡 데모 모드면 5일, 일반 모드면 80일을 마지막 날로 계산
  const isLastDay = day >= (isDemoMode ? 5 : 80);

  const getPanelText = () => {
    switch (hoveredObject) {
      case 'PHONE': return { title: "SNS 찌라시로 정보를 확인해 보세요!", sub: "(소모 행동력 : 0)" };
      case 'NEWSPAPER': return { title: "언론사의 기사로 정보를 확인해 보세요!", sub: "(소모 행동력 : 2)" };
      case 'TV': 
        return isTvWatchedToday 
          ? { title: "오늘의 뉴스는 이미 종료되었습니다.", sub: "내일의 새로운 소식을 기다려주세요!" }
          : { title: "최신 뉴스로 정보를 확인해 보세요!", sub: "(소모 행동력 : 1)" };
      case 'LAPTOP': return { title: "뉴스와 기사에서 얻은 정보로 투자를 진행해 보세요!", sub: "(소모 행동력 : 1)" };
      case 'DESK': 
        return isStudiedToday 
          ? { title: "오늘 할 공부는 이미 다 마쳤다!", sub: "조금 쉬어도 되지 않을까?" }
          : { title: "학생의 본분은 공부! 공부를 너무 안 하면 큰 일이 일어날지도...?", sub: "(소모 행동력 : 1)" };
      case 'BED':
        if (period === 'MORNING') {
          return { title: "오늘 하루도 열심히!", sub: "(사용하지 않은 행동력이 없는지 확인해 주세요.)" };
        } else {
          // 💡 마지막 날이면 텍스트 변경
          if (isLastDay) {
            return { title: "대망의 마지막 밤입니다!", sub: "(클릭하여 투자 결과를 확인하고 엔딩보기)" };
          }
          return { title: "오늘은 이만 쉬어야 겠어요!", sub: "(사용하지 않은 행동력이 없는지 확인해 주세요.)" };
        }
      default:
        return period === 'MORNING' ? { title: `${day}일 차 아침이 밝았습니다!`, sub: "오늘도 활기찬 하루를 시작해볼까?" } : { title: "뉴스와 기사를 보고 투자를 진행해 주세요!", sub: "어제 산 주식이 올랐을까?" };
    }
  };

  const currentText = getPanelText();

  return (
    <div style={{ height: '176px', backgroundColor: '#cd853f', padding: '10px', display: 'flex', gap: '12px', boxSizing: 'border-box' }}>
      
      <div style={{ flex: 1.2, backgroundColor: '#1a1a1a', border: '4px solid #4a3b2c', borderRadius: '8px', padding: '15px', color: '#fff', fontSize: '20px', lineHeight: '1.5', boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.5)' }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>{currentText.title}</p>
        <p style={{ color: '#aaa', fontSize: '16px', marginTop: '8px', marginBottom: 0 }}>{currentText.sub}</p>
      </div>

      <div style={{ flex: 1, backgroundColor: '#cdaa7d', border: '4px solid #4a3b2c', borderRadius: '8px', padding: '8px', boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.2)' }}>
        <ActionButtons 
          hoveredObject={hoveredObject} 
          onHover={onHover} 
          onInteract={onInteract} 
          isStudiedToday={isStudiedToday} 
          isTvWatchedToday={isTvWatchedToday} 
        />
      </div>
    </div>
  );
};

export default BottomPanel;