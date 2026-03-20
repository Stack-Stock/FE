import { create } from 'zustand';

const useGameStore = create((set, get) => ({
  // --------------------------------------------------
  // 1. 상태 (State)
  // --------------------------------------------------
  isDemoMode: false,

  runId: null,
  day: 1,
  period: 'MORNING', 
  money: 0,
  energy: 2,
  holdings: [],        
  tradeLogs: [],       
  availableStocks: [], 
  daySummary: null,    
  articles: [],        
  hasRandomEvent: false,
  settlementAmount: 0,
  sparkCount: 0,       
  studyCount: 0,       
  toast: { message: '', visible: false, type: 'info' },
  todayEventId: null,
  
  // 💡 [추가] 백엔드에서 받아올 엔딩 번호 (1~6)
  endingType: null,

  // --------------------------------------------------
  // 2. 액션 (Actions) - 일반 로직
  // --------------------------------------------------
  setDemoMode: (isDemo) => set({ isDemoMode: isDemo }),
  
  // 💡 [추가] 엔딩 번호 세팅 함수
  setEndingType: (type) => set({ endingType: type }),

  showToast: (message, type = 'info') => {
    set({ toast: { message, visible: true, type } });
    setTimeout(() => set({ toast: { message: '', visible: false, type: 'info' } }), 3000);
  },

  updateAfterTrade: (cash, updatedHoldings) => set({
    money: cash,
    holdings: updatedHoldings
  }),

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
    endingType: null, // 💡 새 게임 시 엔딩 초기화
  }),

  setDailyStartData: (dailyData) => {
    if (!dailyData) return;
    
    const eventId = dailyData.randomEventId || null;
    const startEnergy = eventId === 9 ? 0 : 2;
    
    set((state) => ({
      day: dailyData.portfolio?.currentDayNo || state.day,
      money: dailyData.portfolio?.cashBalance || state.money,
      period: 'MORNING',
      energy: startEnergy, 
      availableStocks: dailyData.tradingScreen?.stocks || [],
      holdings: dailyData.portfolio?.holdings || [],
      daySummary: dailyData.daySummary,
      articles: dailyData.articleArchive?.articles || [],
      hasRandomEvent: dailyData.hasRandomEvent || false,
      settlementAmount: dailyData.settlementAmount || 0,
      sparkCount: dailyData.hasInspiration ? state.sparkCount + 1 : state.sparkCount,
      todayEventId: eventId,
    }));
  },

  nextPeriod: () => set((state) => ({ 
    period: state.period === 'MORNING' ? 'AFTERNOON' : 'NIGHT' 
  })),

  useEnergy: (amount = 1) => set((state) => ({ 
    energy: Math.max(0, state.energy - amount) 
  })),

  resetGame: () => set({ 
    isDemoMode: false,
    runId: null, 
    day: 1, 
    holdings: [], 
    availableStocks: [], 
    articles: [],
    endingType: null // 💡 리셋 시 엔딩 초기화
  }),

  // --------------------------------------------------
  // 3. 파생 상태 (Getters)
  // --------------------------------------------------
  getTotalStockValue: () => {
    const { holdings, availableStocks } = get();
    return holdings.reduce((acc, h) => {
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