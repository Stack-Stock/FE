import React from 'react';
import { motion } from 'framer-motion';

const EnergyConfirmModal = ({ isOpen, onClose, onConfirm, config }) => {
  if (!isOpen) return null;

  const actionVerb = config.actionText || '확인'; // 넘겨받은 동사가 없으면 '확인'을 기본값으로 사용

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1200 }}>
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        style={{ width: '350px', background: '#2c3e50', border: '4px solid #e74c3c', padding: '25px', color: '#fff', textAlign: 'center', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
      >
        <h2 style={{ margin: '0 0 15px 0', color: '#e74c3c', fontSize: '24px' }}>⚠️ 행동력 소모</h2>
        <p style={{ fontSize: '18px', marginBottom: '25px', lineHeight: '1.5' }}>
          행동력 <span style={{color: '#FFD700', fontWeight: 'bold'}}>{config.cost}</span>을(를) 소모하여 <br/> 
          <span style={{color: '#87CEEB'}}>'{config.title}'</span>을(를) {actionVerb}하시겠습니까?
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button onClick={onConfirm} style={{ padding: '8px 20px', backgroundColor: '#2ecc71', color: '#fff', border: '3px solid #27ae60', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>확인</button>
          <button onClick={onClose} style={{ padding: '8px 20px', backgroundColor: '#95a5a6', color: '#fff', border: '3px solid #7f8c8d', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>취소</button>
        </div>
      </motion.div>
    </div>
  );
};

export default EnergyConfirmModal;