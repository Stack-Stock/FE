import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../store/useGameStore'; 
import '../styles/StockModal.css'; 

import StockList from './stock/StockList';
import StockChart from './stock/StockChart';
import StockTradePanel from './stock/StockTradePanel';

const StockModal = ({ isOpen, onClose, onConfirmTrade, isTradedToday }) => {
  const { day, money, holdings, availableStocks } = useGameStore();

  const [selectedStock, setSelectedStock] = useState(null);
  
  // 💡 [핵심] 장바구니 상태 관리: { [stockId]: 변동수량(양수는 매수, 음수는 매도) }
  // 예: { 1: 5, 2: -3 } -> 1번 주식 5주 매수, 2번 주식 3주 매도
  const [pendingTrades, setPendingTrades] = useState({});

  // 모달이 열릴 때 장바구니 초기화 및 첫 종목 선택
  useEffect(() => {
    if (isOpen) {
      setPendingTrades({});
      if (availableStocks && availableStocks.length > 0) {
        setSelectedStock(availableStocks[0]);
      } 
    }
  }, [isOpen, availableStocks]);

  if (!isOpen) return null;

  /**
   * 💡 실시간 예상 자산 계산 (T+3 정산 규칙 반영)
   */
  // 1. 예상 보유 현금: 현재 현금 - (매수 금액 총합). 매도 금액은 T+3이므로 안 더함!
  let expectedMoney = money;
  Object.entries(pendingTrades).forEach(([sId, qtyDiff]) => {
    const stock = availableStocks.find(s => s.stockId === Number(sId));
    if (stock && qtyDiff > 0) { // 매수(양수)일 때만 현금 차감
      expectedMoney -= (stock.currentPrice * qtyDiff);
    }
  });

  // 2. 예상 주식 평가금: 현재 평가금 + 매수 금액 총합 - 매도 금액 총합
  let expectedStockValue = holdings.reduce((acc, holding) => {
    const stock = availableStocks.find(s => s.stockId === holding.stockId);
    const currentPrice = stock ? stock.currentPrice : (holding.avgCost || 0);
    return acc + (currentPrice * holding.quantity); // 💡 qty가 아닌 quantity 유지 (API 스펙)
  }, 0);

  // 장바구니 내역을 평가금에 가감
  Object.entries(pendingTrades).forEach(([sId, qtyDiff]) => {
    const stock = availableStocks.find(s => s.stockId === Number(sId));
    if (stock) {
      // 매수면 더해지고, 매도(음수)면 빼짐
      expectedStockValue += (stock.currentPrice * qtyDiff); 
    }
  });

  const expectedTotalAssets = expectedMoney + expectedStockValue;

  /**
   * 💡 실시간 거래 시뮬레이션 (TradePanel에서 +/- 버튼 누를 때 호출)
   */
  const handleTrade = (stockId, quantity, type) => {
    // type: 'BUY' or 'SELL'
    // quantity: 입력된 거래량 (절대값)
    const qtyChange = type === 'BUY' ? quantity : -quantity;

    setPendingTrades(prev => {
      const currentDiff = prev[stockId] || 0;
      const newDiff = currentDiff + qtyChange;

      // 만약 매수/매도를 취소해서 변동량이 0이 되면 장바구니에서 삭제
      if (newDiff === 0) {
        const newState = { ...prev };
        delete newState[stockId];
        return newState;
      }
      return { ...prev, [stockId]: newDiff };
    });
  };

  /**
   * 💡 거래 확정 버튼 (GamePlay로 데이터 전달 -> API 호출 준비)
   */
  const handleConfirm = () => {
    if (isTradedToday) return;

    // 장바구니가 비어있으면 그냥 닫기 (또는 닫지 않고 경고)
    if (Object.keys(pendingTrades).length === 0) {
      onClose();
      return;
    }
    
    // 백엔드 API 스펙(TradeRequest)에 맞게 배열 변환
    const orders = Object.entries(pendingTrades).map(([sId, qtyDiff]) => ({
      stockId: Number(sId),
      side: qtyDiff > 0 ? 'BUY' : 'SELL',
      quantity: Math.abs(qtyDiff)
    }));

    // 부모 컴포넌트(GamePlay)에 주문서 전달
    onConfirmTrade({ orders }); 
  };

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 }}>
      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} 
        style={{ width: '1000px', height: '650px', background: '#12121c', border: '6px solid #4a69bd', borderRadius: '15px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.8)' }}>
        
        {/* 상단 헤더 영역 */}
        <div style={{ height: '80px', backgroundColor: '#1e3799', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 25px', borderBottom: '4px solid #4a69bd' }}>
          <div style={{ display: 'flex', gap: '40px', color: '#fff' }}>
            <div>
              <div style={{ fontSize: '13px', color: '#d1d8e0' }}>보유 현금 (예상)</div>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: expectedMoney < money ? '#ff4b4b' : '#fff' }}>
                ₩{expectedMoney.toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#d1d8e0' }}>주식 평가금 (예상)</div>
              <div style={{ fontSize: '22px', fontWeight: 'bold' }}>
                ₩{expectedStockValue.toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#FFD700' }}>총 자산 (T+3 미포함)</div>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#FFD700' }}>
                ₩{expectedTotalAssets.toLocaleString()}
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '15px' }}>
            <button onClick={handleConfirm} disabled={isTradedToday || Object.keys(pendingTrades).length === 0} 
              style={{ padding: '8px 16px', backgroundColor: (isTradedToday || Object.keys(pendingTrades).length === 0) ? '#555' : '#fa983a', color: (isTradedToday || Object.keys(pendingTrades).length === 0) ? '#999' : '#fff', border: (isTradedToday || Object.keys(pendingTrades).length === 0) ? '3px solid #333' : '3px solid #e55039', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', cursor: (isTradedToday || Object.keys(pendingTrades).length === 0) ? 'not-allowed' : 'pointer', boxShadow: (isTradedToday || Object.keys(pendingTrades).length === 0) ? 'none' : '2px 2px 0 #000' }}>
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
              stocks={availableStocks} 
              selectedStock={selectedStock} 
              onSelectStock={setSelectedStock} 
              // 💡 로컬 홀딩스 대신, 원래 보유량 + 장바구니 변동량을 합쳐서 리스트에 표시
              localHoldings={availableStocks.map(s => {
                const baseQty = holdings.find(h => h.stockId === s.stockId)?.quantity || 0;
                const diffQty = pendingTrades[s.stockId] || 0;
                return { stockId: s.stockId, qty: baseQty + diffQty };
              })} 
            />
          </div>
          
          {/* 오른쪽 차트 및 주문 패널 */}
          <div style={{ flex: '1 1 70%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <StockChart stock={selectedStock} day={day} />
            <StockTradePanel 
              stock={selectedStock} 
              day={day} 
              // 💡 주문 패널에는 "현재 예상 잔액"과 "장바구니가 반영된 현재 예상 보유 수량"을 넘깁니다.
              localMoney={expectedMoney} 
              myQuantity={(holdings.find(h => h.stockId === selectedStock?.stockId)?.quantity || 0) + (pendingTrades[selectedStock?.stockId] || 0)}
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