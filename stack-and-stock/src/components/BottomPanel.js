import React from 'react';
import ActionButtons from './ActionButtons';

const BottomPanel = ({ isNewsOpen, onHover, onAction, onNewsClick }) => {
  return (
    <div style={{ 
      height: '176px', // 💡 기존 220px의 80%로 축소됨! 나중에 조절하고 싶으시면 이 숫자만 바꾸면 됩니다.
      backgroundColor: '#cd853f', 
      padding: '8px',  // 패딩도 살짝 줄임
      display: 'flex',
      gap: '10px'
    }}>
      
      {/* 좌측 텍스트 다이얼로그 창 */}
      <div style={{ 
        flex: 1.2, 
        backgroundColor: '#1a1a1a', 
        border: '4px solid #4a3b2c', 
        borderRadius: '8px',
        padding: '15px', // 글자가 덜 답답하도록 패딩 축소
        color: '#fff',
        fontSize: '20px', // 높이가 줄었으니 폰트도 24px -> 20px로 조절
        lineHeight: '1.5'
      }}>
        <p>{isNewsOpen ? "신문을 읽는 중입니다..." : "오늘은 무엇을 할까?"}</p>
        <p style={{ color: '#aaa', fontSize: '16px', marginTop: '8px' }}>
          어제 산 주식이 조금 올랐다.
        </p>
      </div>

      {/* 우측 액션 버튼 창 래퍼 */}
      <div style={{ 
        flex: 1, 
        backgroundColor: '#cdaa7d', 
        border: '4px solid #4a3b2c',
        borderRadius: '8px',
        padding: '8px'
      }}>
        <ActionButtons 
          onHover={onHover} 
          onAction={onAction} 
          onNewsClick={onNewsClick} 
        />
      </div>
      
    </div>
  );
};

export default BottomPanel;