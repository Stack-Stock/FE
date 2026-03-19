import { create } from 'zustand';

const useGameStore = create((set, get) => ({
  // --------------------------------------------------
  // 1. 상태 (State)
  // --------------------------------------------------
  runId: null,
  day: 1,
  period: 'MORNING', 
  money: 0,
  energy: 2,

  // 주식 및 자산
  holdings: [],         // 현재 보유 주식 [{stockId, quantity, avgCost, ...}]
  tradeLogs: [],        // 최근 거래 내역
  availableStocks: [],  // 오늘 거래 가능한 주식 목록 (모달용)

  // 뉴스 및 아카이브
  daySummary: null,     // 일일 결산 데이터
  articles: [],         // 뉴스 아카이브 목록

  // 시스템 상태
  hasRandomEvent: false,
  settlementAmount: 0,
  sparkCount: 0,        // 번뜩임 개수
  studyCount: 0,        // 공부 횟수 (3회당 번뜩임 1개)

  // 알림 (Toast)
  toast: { message: '', visible: false, type: 'info' },

  todayEventId: null,

  // --------------------------------------------------
  // 2. 액션 (Actions) - 일반 로직
  // --------------------------------------------------

  // 토스트 메시지 표시
  showToast: (message, type = 'info') => {
    set({ toast: { message, visible: true, type } });
    setTimeout(() => set({ toast: { message: '', visible: false, type: 'info' } }), 3000);
  },

  // 거래 성공 후 데이터 즉시 업데이트
  updateAfterTrade: (cash, updatedHoldings) => set({
    money: cash,
    holdings: updatedHoldings
  }),

  // [액션 A] 새 게임 시작 (StartGameResponse 기반)
  initNewGame: (startData) => set({
    runId: startData.runId,
    day: startData.dayNo,
    period: 'MORNING',
    money: startData.cashBalance,
    energy: startData.apRemaining,
    holdings: [],
    tradeLogs: [],
    availableStocks: [],
    daySummary: null,
    articles: [],
    sparkCount: 0,
    studyCount: 0,
    hasRandomEvent: false,
    settlementAmount: 0,
    todayEventId: null,
  }),

  // [액션 B] 하루 시작 데이터 업데이트 (DailyStartResponse 기반)
  setDailyStartData: (dailyData) => {
    if (!dailyData) return;
    
    // 💡 [핵심] 9번 이벤트(죄책감)일 경우 에너지를 0으로, 아니면 2로 세팅
    const eventId = dailyData.randomEventId || null;
    const startEnergy = eventId === 9 ? 0 : 2;
    
    set((state) => ({
      day: dailyData.portfolio?.currentDayNo || state.day,
      money: dailyData.portfolio?.cashBalance || state.money,
      period: 'MORNING',
      energy: startEnergy, // 💡 페널티 적용
      
      // 주식 목록 매핑 (백엔드 TradingStockResponse -> availableStocks)
      availableStocks: dailyData.tradingScreen?.stocks || [],
      
      // 보유 주식 매핑 (백엔드 PortfolioResponse -> holdings)
      holdings: dailyData.portfolio?.holdings || [],
      
      daySummary: dailyData.daySummary,
      articles: dailyData.articleArchive?.articles || [],
      hasRandomEvent: dailyData.hasRandomEvent || false,
      settlementAmount: dailyData.settlementAmount || 0,
      
      // 번뜩임 지급 처리
      sparkCount: dailyData.hasInspiration ? state.sparkCount + 1 : state.sparkCount,
      todayEventId: eventId,
    }));
  },

  // 시간대 변경 (아침 -> 저녁)
  nextPeriod: () => set((state) => ({ 
    period: state.period === 'MORNING' ? 'AFTERNOON' : 'NIGHT' 
  })),

  // 에너지 소모
  useEnergy: (amount = 1) => set((state) => ({ 
    energy: Math.max(0, state.energy - amount) 
  })),

  // 게임 초기화
  resetGame: () => set({ 
    runId: null, 
    day: 1, 
    holdings: [], 
    availableStocks: [], 
    articles: [] 
  }),

  // --------------------------------------------------
  // 3. 파생 상태 (Getters)
  // --------------------------------------------------
  getTotalStockValue: () => {
    const { holdings, availableStocks } = get();
    return holdings.reduce((acc, h) => {
      // availableStocks에서 현재가를 찾아 계산하거나, 백엔드가 준 evaluationAmount 사용
      const stock = availableStocks.find(s => s.stockId === h.stockId);
      const currentPrice = stock ? stock.currentPrice : h.avgCost;
      return acc + (currentPrice * h.quantity);
    }, 0);
  },
  
  getTotalAssets: () => {
    return get().money + get().getTotalStockValue();
  },
}));

export default useGameStore;