import React from 'react';
import { motion } from 'framer-motion';

// 💡 content 프롭스 추가
const PhoneModal = ({ isOpen, onClose, day, content }) => {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 }}>
      <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        style={{
          width: '320px', height: '550px', background: '#1a1a2e', border: '12px solid #333',
          borderRadius: '30px', padding: '20px', color: '#fff', display: 'flex', flexDirection: 'column'
        }}
      >
        <div style={{ textAlign: 'center', fontSize: '14px', color: '#888', marginBottom: '15px', borderBottom: '1px solid #444', paddingBottom: '10px' }}>
          12:00 PM | 100% 🔋
        </div>
        
        <h2 style={{ fontSize: '20px', color: '#0f3460', backgroundColor: '#fff', padding: '10px', borderRadius: '10px', textAlign: 'center', marginBottom: '20px' }}>SNS 찌라시 타임라인</h2>
        
        <div style={{ flex: 1 }}>
          <div style={{ background: '#16213e', padding: '15px', borderRadius: '12px', border: '1px solid #0f3460' }}>
            <div style={{ fontWeight: 'bold', color: '#e94560', marginBottom: '10px' }}>@익명의_내부자</div>
            {/* 💡 백엔드에서 받은 내용 출력 */}
            <p style={{ lineHeight: '1.5', fontSize: '16px', whiteSpace: 'pre-line' }}>{content}</p>
            <div style={{ marginTop: '15px', fontSize: '12px', color: '#888' }}>💬 12  🔁 105  ❤️ 432</div>
          </div>
        </div>

        <button onClick={onClose} style={{ padding: '12px', backgroundColor: '#e94560', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
          화면 끄기
        </button>
      </motion.div>
    </div>
  );
};

export default PhoneModal;