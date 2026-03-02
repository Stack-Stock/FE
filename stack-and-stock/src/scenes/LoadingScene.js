import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const LoadingScene = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500); // 로고 보여주는 시간
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', 
      height: '100%', color: 'white', backgroundColor: '#000' 
    }}>
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ textAlign: 'center' }}
      >
        <h2 style={{ fontSize: '32px', letterSpacing: '4px' }}>TEAM NOW YOU SEE ME</h2>
        <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
          LOADING ASSETS...
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingScene;