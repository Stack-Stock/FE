import React from 'react';
import { motion } from 'framer-motion';

const TvModal = ({ isOpen, onClose, day }) => {
  if (!isOpen) return null;

  const tvData = [
    { headline: "금리 인상 '쇼크'... 증시 얼어붙나?", subtitle: "중앙은행의 기습 발표에 코스피 하락세" },
    { headline: "[단독] H자동차, 자율주행 레벨5 성공", subtitle: "업계 판도를 뒤집을 혁신 기술 시연" },
    { headline: "IT 업계 인력난 해소되나", subtitle: "SSAFY 14기 수료생들의 활약에 기대감 고조" }
  ];
  const todayTv = tvData[day % tvData.length];

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        style={{
          width: '700px', height: '400px', background: '#222', border: '16px solid #111',
          borderRadius: '15px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column'
        }}
      >
        {/* 뉴스 영상 부분 (가상) */}
        <div style={{ flex: 1, backgroundColor: '#2980b9', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ fontSize: '100px', opacity: 0.2 }}>📰</div>
        </div>

        {/* 자막 (Ticker) 영역 */}
        <div style={{ height: '100px', backgroundColor: '#c0392b', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 20px', color: '#fff' }}>
          <div style={{ backgroundColor: '#f1c40f', color: '#000', display: 'inline-block', padding: '3px 8px', fontWeight: 'bold', width: 'fit-content', marginBottom: '5px' }}>
            [LIVE] 속보
          </div>
          <h2 style={{ margin: 0, fontSize: '24px' }}>{todayTv.headline}</h2>
          <p style={{ margin: '5px 0 0 0', fontSize: '16px', opacity: 0.8 }}>{todayTv.subtitle}</p>
        </div>

        <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', color: '#fff', border: '2px solid #fff', padding: '5px 10px', cursor: 'pointer' }}>
          TV 끄기 ❌
        </button>
      </motion.div>
    </div>
  );
};

export default TvModal;