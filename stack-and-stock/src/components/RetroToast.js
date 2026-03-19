import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../store/useGameStore';

const RetroToast = () => {
  const { toast } = useGameStore();

  return (
    <AnimatePresence>
      {toast.visible && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          style={{
            position: 'fixed', bottom: '200px', left: '50%', transform: 'translateX(-50%)',
            zIndex: 9999, padding: '15px 30px',
            backgroundColor: toast.type === 'error' ? '#e55039' : '#38ada9',
            color: '#fff', border: '4px solid #000',
            boxShadow: '4px 4px 0px #000', fontWeight: 'bold', fontSize: '18px',
            pointerEvents: 'none', textAlign: 'center', minWidth: '300px'
          }}
        >
          {toast.type === 'error' ? '[ ERROR ] ' : '[ INFO ] '}
          {toast.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RetroToast;