import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ARCHIVE_DATA } from '../data/dummyArchiveData';

const ArchiveModal = ({ isOpen, onClose, currentDay }) => {
  // 💡 선택된 일차 (모달이 열릴 때 가장 최근 과거인 어제(currentDay - 1)로 자동 세팅)
  const [selectedDay, setSelectedDay] = useState(1);

  useEffect(() => {
    if (isOpen && currentDay > 1) {
      setSelectedDay(currentDay - 1);
    }
  }, [isOpen, currentDay]);

  if (!isOpen) return null;

  // 💡 1일차부터 어제까지의 배열 생성 및 역순 정렬 (최근 날짜가 맨 위에 오도록)
  const pastDays = Array.from({ length: currentDay - 1 }, (_, i) => i + 1).reverse();
  
  // 선택된 날짜의 기사 데이터 가져오기 (데이터가 없으면 빈 배열)
  const articles = ARCHIVE_DATA[selectedDay] || [];

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
          
          {/* 우측 패널: 기사 상세 내역 */}
          <div className="retro-scrollbar" style={{ flex: '1 1 75%', backgroundColor: '#0a0a0a', border: '3px solid #2f3640', borderRadius: '8px', overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {articles.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#555', fontSize: '18px' }}>
                해당 일차의 특이 기사 기록이 없습니다.
              </div>
            ) : (
              articles.map((article) => (
                <div key={article.id} style={{ backgroundColor: '#1a1a2e', border: `2px solid ${article.impact === 'GOOD' ? '#e74c3c' : '#3498db'}`, borderRadius: '8px', padding: '20px', position: 'relative' }}>
                  
                  {/* 종목 및 실제 기사 날짜 태그 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ backgroundColor: '#34495e', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold' }}>
                      관련 종목: {article.stock}
                    </span>
                    <span style={{ color: '#a4b0be', fontSize: '13px' }}>
                      원본 기사 날짜: {article.realDate}
                    </span>
                  </div>

                  {/* 기사 제목 */}
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', marginBottom: '15px', lineHeight: '1.4' }}>
                    {article.realTitle}
                  </div>

                  {/* 변동 이유 (핵심) */}
                  <div style={{ backgroundColor: '#111', border: '1px solid #333', padding: '15px', borderRadius: '6px' }}>
                    <div style={{ color: '#f39c12', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>[ 시장 변동 원인 분석 ]</div>
                    <div style={{ color: '#d1d8e0', fontSize: '15px', lineHeight: '1.5' }}>
                      {article.reason}
                    </div>
                  </div>

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