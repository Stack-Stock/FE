import React from 'react';
import { motion } from 'framer-motion';

const RainbowGlareParticle = ({ angle }) => {
  const colors = ['#e74c3c', '#ffa502', '#eccc68', '#2ed573', '#1e90ff', '#9c88ff', '#ffffff'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const length = Math.random() * 200 + 150; // 빛줄기 길이

  return (
    <motion.div
      initial={{ width: 0, opacity: 1 }}
      animate={{ width: `${length}px`, opacity: 0 }}
      transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, ease: 'easeOut' }}
      style={{
        position: 'absolute', top: 0, left: 0,
        height: '6px', backgroundColor: color,
        borderRadius: '3px', filter: 'blur(2px) brightness(1.5)',
        boxShadow: `0 0 10px ${color}`,
        transform: `translate(0%, -50%) rotate(${angle}deg)`,
        transformOrigin: '0% 50%',
        zIndex: 55
      }}
    />
  );
};

export default RainbowGlareParticle;