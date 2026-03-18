import React from 'react';
import { motion } from 'framer-motion';

// 💡 content 프롭스 추가
const NewsModal = ({ isOpen, onClose, day, content }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', 
      alignItems: 'center', zIndex: 1100
    }}>
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          width: '700px', background: '#f5f5f5', border: '8px double #333',
          padding: '40px', color: '#000', fontFamily: 'serif' 
        }}
      >
        <div style={{ textAlign: 'center', borderBottom: '2px solid #000', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>THE DAILY RUNTIME</h1>
          <p style={{ fontSize: '14px' }}>제 {day}호 | 2026년 2월 | 나우유씨미;런타임에러 뉴스</p>
        </div>

        <div style={{ padding: '20px 0' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '20px', lineHeight: '1.3', color: '#b33939' }}>
            [ 단독 집중 분석 ]
          </h2>
          {/* 💡 백엔드에서 받은 내용 출력 */}
          <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#333', whiteSpace: 'pre-line' }}>
            {content}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
          <button className="pixel-btn" onClick={onClose} style={{ backgroundColor: '#000', color: '#fff', padding: '10px 30px' }}>
            신문 덮기
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NewsModal;