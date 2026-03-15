import React from 'react';
import { motion } from 'framer-motion';

const StudyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const publicPath = process.env.PUBLIC_URL;
  const imageUrl = `${publicPath}/assets/ui/study_result.png`;

  return (
    <div style={{ 
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
      backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', 
      alignItems: 'center', zIndex: 1100 
    }}>
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        style={{
          width: '600px', // 💡 가로 2배 확대 (300px -> 600px)
          background: '#dcdde1', border: '8px solid #2f3640',
          borderRadius: '15px', padding: '30px', display: 'flex', flexDirection: 'column',
          alignItems: 'center', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
        }}
      >
        {/* 💡 세로 1.5배 확대에 맞춰 이미지 영역 높이 증가 (180px -> 270px) */}
        <div style={{ 
          width: '100%', height: '270px', backgroundColor: '#fff', 
          border: '6px solid #718093', marginBottom: '25px', 
          display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' 
        }}>
          <img src={imageUrl} alt="공부 이미지" style={{ width: '100%', height: '100%', objectFit: 'cover', imageRendering: 'pixelated' }} />
        </div>
        
        {/* 💡 팝업이 커졌으니 글씨 크기도 시원하게 키웠습니다 */}
        <h3 style={{ margin: '0 0 30px 0', color: '#2f3640', fontSize: '32px' }}>
          "열심히 공부하였다!"
        </h3>

        {/* 💡 버튼 크기도 비율에 맞게 확대 */}
        <button onClick={onClose} style={{ 
          padding: '12px 40px', backgroundColor: '#e1b12c', color: '#fff', 
          border: '6px solid #c23616', cursor: 'pointer', fontWeight: 'bold', fontSize: '24px' 
        }}>
          닫기
        </button>
      </motion.div>
    </div>
  );
};

export default StudyModal;