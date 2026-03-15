import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HelpSidebar from './help/HelpSidebar';
import HelpContent from './help/HelpContent';

const HelpModal = ({ isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 모달이 열릴 때 항상 1번 항목(인덱스 0)으로 초기화
  useEffect(() => {
    if (isOpen) setCurrentIndex(0);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1300 }}>
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        style={{ width: '900px', height: '650px', background: '#12121c', border: '6px solid #e74c3c', borderRadius: '15px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.8)' }}
      >
        
        {/* 상단 헤더 */}
        <div style={{ height: '70px', backgroundColor: '#c0392b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 25px', borderBottom: '4px solid #e74c3c' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px' }}>
            <h2 style={{ color: '#fff', fontSize: '24px', margin: 0, letterSpacing: '2px' }}>[ 게임 도움말 ]</h2>
            <span style={{ color: '#f5b041', fontSize: '14px' }}>게임의 주요 기능을 알아보세요.</span>
          </div>
          <button onClick={onClose} style={{ padding: '6px 15px', backgroundColor: '#333', color: '#fff', border: '3px solid #555', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>X</button>
        </div>

        {/* 본문 레이아웃 (좌측 목차, 우측 내용) */}
        <div style={{ flex: 1, display: 'flex', padding: '15px', gap: '15px', height: 'calc(100% - 70px)' }}>
          <HelpSidebar currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />
          <HelpContent currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />
        </div>

      </motion.div>
    </div>
  );
};

export default HelpModal;