import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../store/useGameStore'; 

const ArchiveModal = ({ isOpen, onClose, currentDay }) => {
  const [selectedDay, setSelectedDay] = useState(1);
  const { articles } = useGameStore(); 

  useEffect(() => {
    if (isOpen && currentDay > 1) {
      setSelectedDay(currentDay - 1);
    }
  }, [isOpen, currentDay]);

  if (!isOpen) return null;

  const pastDays = Array.from({ length: currentDay - 1 }, (_, i) => i + 1).reverse();
  const dayArticles = articles.filter(article => article.dayNo === selectedDay);

  // 💡 [추가] 날짜 데이터에서 'T' 이후의 시간(Time)을 잘라내는 함수
  const formatDate = (dateString) => {
    if (!dateString) return '날짜 확인 불가';
    // 예: "2025-03-24T10:30:29" -> ["2025-03-24", "10:30:29"] -> "2025-03-24" 반환
    return dateString.split('T')[0];
  };

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 }}>
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        style={{ width: '900px', height: '600px', background: '#12121c', border: '6px solid #8e44ad', borderRadius: '15px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.8)' }}
      >
        
        {/* 상단 헤더 영역 */}
        <div style={{ height: '70px', backgroundColor: '#5b2c6f', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 25px', borderBottom: '4px solid #8e44ad' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px' }}>
            <h2 style={{ color: '#fff', fontSize: '24px', margin: 0, letterSpacing: '2px' }}>[ 기사 아카이브 ]</h2>
            <span style={{ color: '#d1d8e0', fontSize: '14px' }}>지나간 시장의 단서를 확인하세요.</span>
          </div>
          <button onClick={onClose} style={{ padding: '6px 15px', backgroundColor: '#333', color: '#fff', border: '3px solid #555', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>X</button>
        </div>

        {/* 본문 2단 레이아웃 */}
        <div style={{ flex: 1, display: 'flex', padding: '15px', gap: '15px', height: 'calc(100% - 70px)' }}>
          
          {/* 좌측 패널: 과거 일차 리스트 */}
          <div className="retro-scrollbar" style={{ flex: '1 1 25%', backgroundColor: '#1a1a2e', border: '3px solid #2f3640', borderRadius: '8px', overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ color: '#a4b0be', fontSize: '12px', textAlign: 'center', marginBottom: '5px', fontWeight: 'bold' }}>- 지난 기록 -</div>
            {pastDays.length === 0 ? (
              <div style={{ color: '#666', textAlign: 'center', marginTop: '20px' }}>기록이 없습니다.</div>
            ) : (
              pastDays.map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', borderRadius: '6px',
                    backgroundColor: selectedDay === day ? '#8e44ad' : '#222',
                    color: selectedDay === day ? '#fff' : '#aaa',
                    border: selectedDay === day ? '2px solid #fff' : '2px solid #444',
                    transition: 'all 0.1s'
                  }}
                >
                  Day {day}
                </button>
              ))
            )}
          </div>
          
          {/* 우측 패널: 실제 기사 상세 내역 */}
          <div className="retro-scrollbar" style={{ flex: '1 1 75%', backgroundColor: '#0a0a0a', border: '3px solid #2f3640', borderRadius: '8px', overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {dayArticles.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#555', fontSize: '18px' }}>
                해당 일차의 특이 기사 기록이 없습니다.
              </div>
            ) : (
              dayArticles.map((article, index) => (
                <div key={index} style={{ backgroundColor: '#1a1a2e', border: '2px solid #3498db', borderRadius: '8px', padding: '20px', position: 'relative' }}>
                  
                  {/* 상단: 종목 아이디 및 기사 발행일 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                    <span style={{ backgroundColor: '#34495e', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold' }}>
                      관련 종목 번호: {article.stockId}
                    </span>
                    <span style={{ color: '#a4b0be', fontSize: '13px' }}>
                      {/* 💡 [수정] 위에서 만든 formatDate 함수를 씌워서 날짜만 출력 */}
                      기사 날짜: {formatDate(article.publishedAt)}
                    </span>
                  </div>

                  {/* 기사 제목 */}
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', marginBottom: '15px', lineHeight: '1.4' }}>
                    {article.title}
                  </div>

                  {/* 변동 이유 (스토리) */}
                  <div style={{ backgroundColor: '#111', border: '1px solid #333', padding: '15px', borderRadius: '6px', marginBottom: '15px' }}>
                    <div style={{ color: '#f39c12', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>[ 시장 변동 원인 분석 ]</div>
                    <div style={{ color: '#d1d8e0', fontSize: '15px', lineHeight: '1.5' }}>
                      {article.story}
                    </div>
                  </div>

                  {/* 원문 기사 링크 버튼 */}
                  {article.url && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={{ 
                          display: 'inline-block', 
                          padding: '8px 16px', 
                          backgroundColor: '#27ae60', 
                          color: '#fff', 
                          textDecoration: 'none', 
                          fontWeight: 'bold', 
                          fontSize: '14px', 
                          borderRadius: '6px', 
                          border: '2px solid #1e8449',
                          boxShadow: '0 3px 0 #145a32',
                          transition: 'all 0.1s'
                        }}
                        onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(3px)'; e.currentTarget.style.boxShadow = 'none'; }}
                        onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 3px 0 #145a32'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 3px 0 #145a32'; }}
                      >
                        원문 기사 보기 🔗
                      </a>
                    </div>
                  )}

                </div>
              ))
            )}
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default ArchiveModal;