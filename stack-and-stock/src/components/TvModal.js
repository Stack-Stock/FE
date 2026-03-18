import React from 'react';
import { motion } from 'framer-motion';

// 💡 content 프롭스 추가
const TvModal = ({ isOpen, onClose, day, content }) => {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        style={{
          width: '700px', height: '400px', background: '#222', border: '16px solid #111',
          borderRadius: '15px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column'
        }}
      >
        <div style={{ flex: 1, backgroundColor: '#2980b9', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ fontSize: '100px', opacity: 0.2 }}>📰</div>
        </div>

        <div style={{ height: '130px', backgroundColor: '#c0392b', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 20px', color: '#fff' }}>
          <div style={{ backgroundColor: '#f1c40f', color: '#000', display: 'inline-block', padding: '3px 8px', fontWeight: 'bold', width: 'fit-content', marginBottom: '8px' }}>
            [LIVE] 속보
          </div>
          {/* 💡 백엔드에서 받은 내용 출력 */}
          <h2 style={{ margin: 0, fontSize: '20px', lineHeight: '1.4' }}>{content}</h2>
        </div>

        <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', color: '#fff', border: '2px solid #fff', padding: '5px 10px', cursor: 'pointer' }}>
          TV 끄기 ❌
        </button>
      </motion.div>
    </div>
  );
};

export default TvModal;