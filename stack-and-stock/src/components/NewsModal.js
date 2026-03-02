import React from 'react';
import { motion } from 'framer-motion';

const NewsModal = ({ isOpen, onClose, day }) => {
  if (!isOpen) return null;

  // 더미 뉴스 데이터셋 (나중에 이 데이터에 따라 주가 변동 확률을 조정할 수 있음)
  const newsPool = [
    { title: "삼성전자, 차세대 반도체 발표!", content: "세계 최초 1nm 공정 성공 소식에 투자자들이 몰리고 있습니다.", impact: "SAMSUNG_UP" },
    { title: "네이버, AI 서비스 중단 위기?", "content": "서버 과부하로 인한 서비스 장애가 지속되며 주가가 휘청이고 있습니다.", impact: "NAVER_DOWN" },
    { title: "SSAFY 14기 수료생 전원 취업 성공", content: "개발자 시장에 엄청난 인재들이 쏟아져 나오며 IT 업계가 들썩입니다.", impact: "SSAFY_UP" },
    { title: "금리 인상 발표, 시장은 '긴장'", content: "중앙은행의 갑작스러운 금리 인상 발표로 전체적인 투자 심리가 위축되었습니다.", impact: "ALL_DOWN" },
    { title: "기계공학 전공자들, 소프트웨어로 대거 전향", content: "최근 하드웨어보다 소프트웨어 역량이 중요해지며 전공자들의 코딩 열풍이 셉니다.", impact: "NONE" }
  ];

  // 오늘의 뉴스 하나를 랜덤으로 선택 (Day를 시드로 쓰면 그날은 같은 뉴스가 나옴)
  const todayNews = newsPool[day % newsPool.length];

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', 
      alignItems: 'center', zIndex: 1100
    }}>
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          width: '700px', background: '#f5f5f5', border: '8px double #333',
          padding: '40px', color: '#000', fontFamily: 'serif' // 신문 느낌을 위해 세리프체 권장
        }}
      >
        <div style={{ textAlign: 'center', borderBottom: '2px solid #000', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>THE DAILY RUNTIME</h1>
          <p style={{ fontSize: '14px' }}>제 {day}호 | 2026년 2월 | 나우유씨미;런타임에러 뉴스</p>
        </div>

        <div style={{ padding: '20px 0' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '20px', lineHeight: '1.3' }}>
            " {todayNews.title} "
          </h2>
          <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#333' }}>
            {todayNews.content}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
          <button className="pixel-btn" onClick={onClose} style={{ backgroundColor: '#000', color: '#fff' }}>
            신문 덮기
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NewsModal;