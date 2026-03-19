import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../store/useGameStore'; 
import '../styles/StockModal.css'; 
// import { STOCK_LIST } from '../data/dummyStockData'; // 💡 더미 데이터 제거

import StockList from './stock/StockList';
import StockChart from './stock/StockChart';
import StockTradePanel from './stock/StockTradePanel';

const StockModal = ({ isOpen, onClose, onConfirmTrade, isTradedToday }) => {
  // 💡 스토어에서 실시간 주식 정보(availableStocks)와 현재 자산 정보를 가져옵니다.
  const { day, money, holdings, availableStocks } = useGameStore();

  const [localMoney, setLocalMoney] = useState(money);
  const [localHoldings, setLocalHoldings] = useState(holdings);
  const [selectedStock, setSelectedStock] = useState(null);

  // 모달이 열릴 때 스토어의 데이터를 로컬 상태로 복사 (동기화)
  useEffect(() => {
    if (isOpen) {
      setLocalMoney(money);
      setLocalHoldings(Array.isArray(holdings) ? holdings : []);
      
      // 💡 백엔드에서 받은 데이터 중 첫 번째 주식을 기본 선택
      if (availableStocks && availableStocks.length > 0) {
        setSelectedStock(availableStocks[0]);
      } 
    }
  }, [isOpen, money, holdings, availableStocks]);

  if (!isOpen) return null;

  /**
   * 💡 실시간 거래 시뮬레이션 (로컬 상태만 변경)
   */
  const handleTrade = (stockId, quantity, price, type) => {
    const totalAmount = price * quantity;
    
    if (type === 'BUY') {
      setLocalMoney(prev => prev - totalAmount);
      setLocalHoldings(prev => {
        const newHoldings = [...prev];
        const existingIndex = newHoldings.findIndex(h => h.stockId === stockId);
        
        if (existingIndex >= 0) {
          const h = newHoldings[existingIndex];
          const newQty = Number(h.quantity) + Number(quantity);
          // 평단가 계산: (기존총액 + 신규총액) / 전체수량
          const newAvg = ((Number(h.quantity) * Number(h.avgCost)) + totalAmount) / newQty;
          newHoldings[existingIndex] = { ...h, quantity: newQty, avgCost: newAvg };
        } else {
          // 신규 매수 시 주식 정보 찾기
          const stockInfo = availableStocks.find(s => s.stockId === stockId);
          newHoldings.push({ 
            stockId, 
            quantity: Number(quantity), 
            avgCost: price, 
            companyName: stockInfo?.companyName, 
            ticker: stockInfo?.ticker || "TEMP" 
          });
        }
        return newHoldings;
      });
    } else if (type === 'SELL') {
      setLocalMoney(prev => prev + totalAmount);
      setLocalHoldings(prev => 
        prev.map(h => h.stockId === stockId ? { ...h, quantity: h.quantity - quantity } : h)
            .filter(h => h.quantity > 0) // 수량 0이면 목록에서 제거
      );
    }
  };

  /**
   * 💡 거래 확정 버튼 (부모인 GamePlay로 데이터 전달 -> API 호출)
   */
  const handleConfirm = () => {
    if (isTradedToday) return;
    
    // 현재 선택된 주식과 입력된 수량 정보를 전달 (GamePlay에서 이 데이터를 기반으로 API를 쏩니다)
    // Cart 방식(여러 종목 한꺼번에)이 아니라면 단일 종목 정보를 넘기도록 구조화하세요.
    onConfirmTrade({ 
      finalMoney: localMoney, 
      finalHoldings: localHoldings 
      // 만약 단일 종목 거래라면 여기에 stockId, quantity, side를 담아 보내면 좋습니다.
    }); 
  };

  // 💡 백엔드에서 준 실시간 주가(closePrice)로 평가금 실시간 계산
  const stockValue = localHoldings.reduce((acc, holding) => {
    const stock = availableStocks.find(s => s.stockId === holding.stockId);
    const currentPrice = stock ? stock.closePrice : (holding.avgCost || 0);
    return acc + (currentPrice * holding.quantity);
  }, 0);

  const totalAssets = localMoney + stockValue;

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 }}>
      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} 
        style={{ width: '1000px', height: '650px', background: '#12121c', border: '6px solid #4a69bd', borderRadius: '15px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.8)' }}>
        
        {/* 상단 헤더 영역 */}
        <div style={{ height: '80px', backgroundColor: '#1e3799', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 25px', borderBottom: '4px solid #4a69bd' }}>
          <div style={{ display: 'flex', gap: '40px', color: '#fff' }}>
            <div><div style={{ fontSize: '13px', color: '#d1d8e0' }}>보유 현금</div><div style={{ fontSize: '22px', fontWeight: 'bold' }}>₩{localMoney.toLocaleString()}</div></div>
            <div><div style={{ fontSize: '13px', color: '#d1d8e0' }}>주식 평가금</div><div style={{ fontSize: '22px', fontWeight: 'bold' }}>₩{stockValue.toLocaleString()}</div></div>
            <div><div style={{ fontSize: '13px', color: '#FFD700' }}>총 자산</div><div style={{ fontSize: '22px', fontWeight: 'bold', color: '#FFD700' }}>₩{totalAssets.toLocaleString()}</div></div>
          </div>
          
          <div style={{ display: 'flex', gap: '15px' }}>
            <button onClick={handleConfirm} disabled={isTradedToday} 
              style={{ padding: '8px 16px', backgroundColor: isTradedToday ? '#555' : '#fa983a', color: isTradedToday ? '#999' : '#fff', border: isTradedToday ? '3px solid #333' : '3px solid #e55039', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', cursor: isTradedToday ? 'not-allowed' : 'pointer', boxShadow: isTradedToday ? 'none' : '2px 2px 0 #000' }}>
              {isTradedToday ? '[금일 거래 마감]' : '[거래 확정 및 종료]'}
            </button>
            <button onClick={onClose} style={{ padding: '8px 15px', backgroundColor: '#333', color: '#fff', border: '3px solid #555', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>X</button>
          </div>
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div style={{ flex: 1, display: 'flex', padding: '12px', gap: '12px', height: 'calc(100% - 80px)' }}>
          {/* 왼쪽 주식 목록 */}
          <div style={{ flex: '1 1 30%', display: 'flex', minWidth: '250px' }}>
            <StockList 
              stocks={availableStocks} // 💡 더미 대신 백엔드 주식 리스트 전달
              selectedStock={selectedStock} 
              onSelectStock={setSelectedStock} 
              localHoldings={localHoldings} 
            />
          </div>
          
          {/* 오른쪽 차트 및 주문 패널 */}
          <div style={{ flex: '1 1 70%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <StockChart stock={selectedStock} day={day} />
            <StockTradePanel 
              stock={selectedStock} 
              day={day} 
              localMoney={localMoney} 
              localHoldings={localHoldings} 
              onTrade={handleTrade} 
              isTradedToday={isTradedToday} 
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StockModal;