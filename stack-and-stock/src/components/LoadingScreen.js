import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = ({ bgImage, text = "NOW LOADING..." }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'absolute', // 💡 [수정] fixed에서 absolute로 변경!
        top: 0, left: 0, width: '100%', height: '100%',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        padding: '50px',
        zIndex: 9999, // 게임 프레임 내에서 최상단 유지
        imageRendering: 'pixelated',
        boxSizing: 'border-box' // 패딩이 삐져나가지 않게 방지
      }}
    >
      {/* 반투명 오버레이 */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', zIndex: -1 }} />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <motion.h1 
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          style={{ 
            color: '#FFD700', 
            fontSize: '48px', 
            margin: 0,
            textShadow: '4px 4px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000' 
          }}
        >
          {text}
        </motion.h1>
        <p style={{ 
          color: '#fff', 
          fontSize: '18px', 
          marginTop: '15px', 
          textShadow: '2px 2px 0 #000' 
        }}>
          서버에서 방대한 세계관을 구축하는 중입니다...
        </p>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;