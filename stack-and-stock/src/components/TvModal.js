import React from 'react';
import { motion } from 'framer-motion';
// 스타일 파일이 있다면 임포트하여 retro-scrollbar 클래스가 적용되게 해주세요.
import '../styles/StockModal.css'; // (스크롤바 CSS가 있는 경로로 맞춰주세요)

const TvModal = ({ isOpen, onClose, day, content }) => {
  if (!isOpen) return null;

  const publicPath = process.env.PUBLIC_URL;
  // 💡 [수정] 준비하신 TV 에셋 이미지 경로를 여기에 적어주세요!
  // 예: /assets/ui/tv_news_image.png
  const tvAssetPath = `${publicPath}/assets/ui/tv_news_image.png`; 

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        style={{
          width: '700px', height: '400px', background: '#222', border: '16px solid #111',
          borderRadius: '15px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column'
        }}
      >
        {/* 💡 1. 파란 배경 대신 유저가 준비한 에셋 이미지를 꽉 차게 넣습니다. */}
        <div style={{ flex: 1, backgroundColor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
          <img 
            src={tvAssetPath} 
            alt="TV News Background" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', imageRendering: 'pixelated' }} 
            // 만약 이미지 경로를 못 찾으면 임시로 기존 파란 화면이 나오게 하는 방어 코드
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.style.backgroundColor = '#2980b9';
            }}
          />
        </div>

        {/* 💡 2. 자막(Ticker) 영역: 높이를 살짝 키우고 스크롤 가능하게 변경 */}
        <div style={{ height: '150px', backgroundColor: '#c0392b', display: 'flex', flexDirection: 'column', padding: '15px 20px', color: '#fff', boxSizing: 'border-box' }}>
          
          <div style={{ backgroundColor: '#f1c40f', color: '#000', display: 'inline-block', padding: '3px 8px', fontWeight: 'bold', width: 'fit-content', marginBottom: '10px', fontSize: '14px' }}>
            [LIVE] 속보
          </div>
          
          {/* 💡 이 div 안에 내용이 길면 내부적으로 스크롤이 생깁니다. */}
          <div className="retro-scrollbar" style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
            <p style={{ margin: 0, fontSize: '18px', lineHeight: '1.6', wordBreak: 'keep-all' }}>
              {content}
            </p>
          </div>

        </div>

        <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', color: '#fff', border: '2px solid #fff', padding: '5px 10px', cursor: 'pointer', zIndex: 10 }}>
          TV 끄기 ❌
        </button>
      </motion.div>
    </div>
  );
};

export default TvModal;