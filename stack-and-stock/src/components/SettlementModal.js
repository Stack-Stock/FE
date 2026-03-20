import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../store/useGameStore'; 

const SettlementModal = ({ isOpen, onClose }) => {
  // 💡 스토어 구독
  const { day, money: currentMoney, holdings, tradeLogs, daySummary: settlementData } = useGameStore();
  const [activeTab, setActiveTab] = useState('SETTLEMENT');

  useEffect(() => {
    if (!isOpen) setActiveTab('SETTLEMENT');
  }, [isOpen]);

  if (!isOpen) return null;

  // 1️⃣ 탭 1: 일일 정산 계산 (daySummary)
  const { assetChange = 0, cashChange = 0, stockValueChange = 0 } = settlementData || {};

  const formatChange = (amount) => {
    if (amount > 0) return { text: `+₩${amount.toLocaleString()}`, color: '#2ecc71' }; // 상승 빨간색(한국 기준)으로 하고 싶다면 '#ff4b4b' 추천
    if (amount < 0) return { text: `-₩${Math.abs(amount).toLocaleString()}`, color: '#4b4bff' };
    return { text: `+₩0`, color: '#a4b0be' };
  };

  // 2️⃣ 탭 2: 보유 주식 및 총 자산 계산 (백엔드 실제 데이터 사용)
  let currentStockValue = 0;
  
  const holdingsList = (Array.isArray(holdings) ? holdings : []).map((info) => {
    // 💡 [수정] STOCK_INFO 참조를 삭제하고 백엔드가 주는 companyName만 사용합니다!
    const companyName = info.companyName || `종목 ${info.stockId}`;
    const quantity = info.quantity || 0;
    const avgCost = info.avgCost || 0;
    const currentPrice = info.currentPrice || 0;
    const evaluationAmount = info.evaluationAmount || 0;
    
    currentStockValue += evaluationAmount;
    
    // 수익률 직접 계산 (백엔드에서 안 주면 프론트에서 계산)
    const returnRate = avgCost > 0 ? (((currentPrice - avgCost) / avgCost) * 100).toFixed(2) : 0;
    const isProfitable = currentPrice >= avgCost;

    return { 
      companyName, 
      quantity, 
      avgCost, 
      currentPrice, 
      evaluationAmount, 
      returnRate, 
      isProfitable 
    };
  });

  const totalAssets = currentMoney + currentStockValue;

  const tabStyle = (tabName) => ({
    flex: 1, padding: '15px 0', textAlign: 'center', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px',
    backgroundColor: activeTab === tabName ? '#1e2749' : '#111', color: activeTab === tabName ? '#fff' : '#888',
    borderBottom: activeTab === tabName ? '3px solid #4a69bd' : '1px solid #333', transition: 'all 0.2s'
  });

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1200 }}>
      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ width: '700px', height: '650px', background: '#12121c', border: '4px solid #4a69bd', borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.8)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 25px', backgroundColor: '#5b2c6f' }}>
          <div>
            <h2 style={{ color: '#fff', fontSize: '24px', margin: '0 0 5px 0' }}>[ 포트폴리오 ] Day {day > 1 ? day - 1 : day}</h2>
            <p style={{ color: '#d1d8e0', margin: 0, fontSize: '14px' }}>내 자산 현황과 거래 기록을 확인하세요.</p>
          </div>
          <button onClick={onClose} style={{ padding: '5px 15px', backgroundColor: '#333', color: '#fff', border: '2px solid #555', borderRadius: '6px', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
        </div>

        <div style={{ display: 'flex', backgroundColor: '#0a0a0a' }}>
          <div style={tabStyle('SETTLEMENT')} onClick={() => setActiveTab('SETTLEMENT')}>일일 정산</div>
          <div style={tabStyle('HOLDINGS')} onClick={() => setActiveTab('HOLDINGS')}>보유 주식</div>
          <div style={tabStyle('LOGS')} onClick={() => setActiveTab('LOGS')}>거래 내역</div>
        </div>

        <div className="retro-scrollbar" style={{ flex: 1, padding: '25px', overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            
            {activeTab === 'SETTLEMENT' && (
              <motion.div key="SETTLEMENT" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.05 }}>
                <div style={{ backgroundColor: '#1e2749', border: '2px solid #4a69bd', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
                  <div style={{ color: '#d1d8e0', fontSize: '14px', marginBottom: '8px' }}>총 자산 변동</div>
                  <div style={{ color: formatChange(assetChange).color, fontSize: '36px', fontWeight: 'bold' }}>{formatChange(assetChange).text}</div>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ flex: 1, backgroundColor: '#1a1a2e', border: '2px solid #2f3640', borderRadius: '8px', padding: '20px' }}>
                    <div style={{ color: '#a4b0be', fontSize: '14px', marginBottom: '8px' }}>현금 변동</div>
                    <div style={{ color: formatChange(cashChange).color, fontSize: '24px', fontWeight: 'bold' }}>{formatChange(cashChange).text}</div>
                  </div>
                  <div style={{ flex: 1, backgroundColor: '#1a1a2e', border: '2px solid #2f3640', borderRadius: '8px', padding: '20px' }}>
                    <div style={{ color: '#a4b0be', fontSize: '14px', marginBottom: '8px' }}>주식 평가금 변동</div>
                    <div style={{ color: formatChange(stockValueChange).color, fontSize: '24px', fontWeight: 'bold' }}>{formatChange(stockValueChange).text}</div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'HOLDINGS' && (
              <motion.div key="HOLDINGS" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.05 }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ flex: 1, backgroundColor: '#111', padding: '15px', borderRadius: '8px', border: '2px solid #333' }}>
                    <div style={{ color: '#FFD700', fontSize: '13px', marginBottom: '5px' }}>총 자산</div>
                    <div style={{ color: '#FFD700', fontSize: '20px', fontWeight: 'bold' }}>₩{totalAssets.toLocaleString()}</div>
                  </div>
                  <div style={{ flex: 1, backgroundColor: '#111', padding: '15px', borderRadius: '8px', border: '2px solid #333' }}>
                    <div style={{ color: '#888', fontSize: '13px', marginBottom: '5px' }}>보유 현금</div>
                    <div style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>₩{currentMoney.toLocaleString()}</div>
                  </div>
                  <div style={{ flex: 1, backgroundColor: '#111', padding: '15px', borderRadius: '8px', border: '2px solid #333' }}>
                    <div style={{ color: '#888', fontSize: '13px', marginBottom: '5px' }}>주식 평가금</div>
                    <div style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>₩{currentStockValue.toLocaleString()}</div>
                  </div>
                </div>

                <h3 style={{ color: '#fff', fontSize: '18px', borderBottom: '2px solid #333', paddingBottom: '10px', margin: '0 0 15px 0' }}>내 주식 목록</h3>
                {holdingsList.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#666', padding: '30px', fontSize: '16px' }}>보유 중인 주식이 없습니다.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {holdingsList.map((item, idx) => (
                      <div key={idx} style={{ backgroundColor: '#1a1a2e', border: '2px solid #2f3640', borderRadius: '8px', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>
                            {item.companyName} <span style={{ color: '#2e86de', fontSize: '13px', marginLeft: '5px' }}>{item.quantity}주</span>
                          </div>
                          <div style={{ color: '#aaa', fontSize: '13px' }}>평단가: ₩{item.avgCost.toLocaleString()}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>₩{item.evaluationAmount.toLocaleString()}</div>
                          <div style={{ color: item.isProfitable ? '#ff4b4b' : '#4b4bff', fontSize: '14px', fontWeight: 'bold' }}>
                            {item.isProfitable ? '▲' : '▼'} {Math.abs(item.returnRate)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'LOGS' && (
              <motion.div key="LOGS" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.05 }}>
                {(!tradeLogs || tradeLogs.length === 0) ? (
                  <div style={{ textAlign: 'center', color: '#666', padding: '30px', fontSize: '16px' }}>거래 내역이 없습니다.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[...tradeLogs].reverse().map((log) => {
                      const type = log.tradeType || log.type;
                      return (
                        <div key={log.tradeId || log.id} style={{ display: 'flex', alignItems: 'center', backgroundColor: '#111', border: '1px solid #333', borderRadius: '6px', padding: '15px' }}>
                          <div style={{ width: '70px', color: '#888', fontSize: '14px', fontWeight: 'bold' }}>Day {log.dayNo || log.day}</div>
                          <div style={{ flex: 1, color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>{log.company || log.stockName}</div>
                          <div style={{ width: '80px', color: '#aaa', fontSize: '14px', textAlign: 'right' }}>{log.quantity}주</div>
                          <div style={{ width: '130px', color: '#ccc', fontSize: '14px', textAlign: 'right' }}>₩{log.price.toLocaleString()}</div>
                          <div style={{ width: '80px', textAlign: 'right', fontWeight: 'bold', fontSize: '15px', color: type === 'BUY' ? '#ff4757' : '#1e90ff' }}>
                            {type === 'BUY' ? '매수' : '매도'}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default SettlementModal;