import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const EventResult = ({ title, data, onConfirm }) => {
  const [displayText, setDisplayText] = useState('');
  const publicPath = process.env.PUBLIC_URL;

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayText(data.text.substring(0, i));
      if (i >= data.text.length) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [data.text]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center' }}>
      <h2 style={{ fontSize: '32px', color: '#fff', marginBottom: '30px' }}>{title}</h2>
      <div style={{ width: '800px', height: '400px', border: '4px solid #fff', marginBottom: '30px', overflow: 'hidden' }}>
        <img src={`${publicPath}/assets/event/result/${data.img}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="result" />
      </div>
      <div style={{ width: '800px', minHeight: '140px', border: '3px solid #fff', backgroundColor: 'rgba(0,0,0,0.8)', padding: '25px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <p style={{ fontSize: '20px', color: '#fff', lineHeight: '1.6' }}>{displayText}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button className="pixel-btn" onClick={onConfirm}>확인</button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventResult;