import { create } from 'zustand';

const useGameStore = create((set, get) => ({
  // --------------------------------------------------
  // 1. 상태 (State) - 게임의 모든 데이터
  // --------------------------------------------------
  runId: null,
  day: 1,
  period: 'MORNING', // 'MORNING' | 'AFTERNOON' | 'NIGHT'
  money: 0,
  energy: 2,

  // 포트폴리오 & 거래 (배열)
  holdings: [],
  tradeLogs: [],

  // 주식 시장 데이터 (거래 모달용)
  availableStocks: [], 

  // 정산 및 아카이브 (Settlement, Archive)
  daySummary: null,
  articles: [],

  // 하루 시작 이벤트 플래그
  hasRandomEvent: false,
  settlementAmount: 0,

  // 플레이어 능력치
  sparkCount: 0,
  studyCount: 0,

  toast: { message: '', visible: false, type: 'info' }, // 💡 토스트 상태 추가

  // 💡 토스트 표시 액션
  showToast: (message, type = 'info') => {
    set({ toast: { message, visible: true, type } });
    setTimeout(() => set({ toast: { message: '', visible: false, type: 'info' } }), 3000);
  },

  // 💡 거래 성공 후 데이터 부분 업데이트 액션
  updateAfterTrade: (cash, holdings) => set({
    money: cash,
    holdings: holdings
  }),

  // --------------------------------------------------
  // 2. 파생 상태 (Getters) - 반복 계산 방지
  // --------------------------------------------------
  getTotalStockValue: () => {
    const { holdings } = get();
    return holdings.reduce((acc, stock) => {
      // 백엔드가 계산해준 evaluationAmount가 있으면 쓰고, 없으면 (수량 * 평단가)로 임시 계산
      return acc + (stock.evaluationAmount || (stock.quantity * stock.avgCost) || 0);
    }, 0);
  },
  getTotalAssets: () => {
    return get().money + get().getTotalStockValue();
  },

  // --------------------------------------------------
  // 3. 액션 (Actions) - 데이터 덮어쓰기
  // --------------------------------------------------
  
  // [액션 A] 1일 차: "새 게임 시작" (StartGameResponse 기반)
  initNewGame: (startData) => set({
    runId: startData.runId,
    day: startData.dayNo,
    period: 'MORNING',
    money: startData.cashBalance,
    energy: startData.apRemaining,
    holdings: [], // 1일 차니까 빈 배열
    tradeLogs: [],
    availableStocks: [],
    daySummary: null,
    articles: [],
    sparkCount: 0,
    studyCount: 0,
    hasRandomEvent: false,
    settlementAmount: 0,
  }),

  // [액션 B] 2일 차 이상: "하루 시작" (DailyStartResponse 덩어리 투하!)
  setDailyStartData: (dailyData) => set((state) => ({
    day: dailyData.portfolio.currentDayNo,
    period: 'MORNING',
    money: dailyData.portfolio.cashBalance,
    energy: 2, // 하루 시작 시 기본 에너지 리필 (백엔드 명세에 없다면 프론트 고정)
    holdings: dailyData.portfolio.holdings,
    tradeLogs: dailyData.portfolio.trades,
    daySummary: dailyData.daySummary,
    articles: dailyData.articleArchive?.articles || [],
    availableStocks: dailyData.tradingScreen?.stocks || [],
    hasRandomEvent: dailyData.hasRandomEvent,
    settlementAmount: dailyData.settlementAmount,
    // 번뜩임을 얻었다면 기존 개수에서 +1
    sparkCount: dailyData.hasInspiration ? state.sparkCount + 1 : state.sparkCount, 
  })),

  // [액션 C] 게임 진행용 유틸 함수들
  nextPeriod: () => set((state) => ({ 
    period: state.period === 'MORNING' ? 'AFTERNOON' : 'NIGHT' 
  })),
  useEnergy: (amount = 1) => set((state) => ({ 
    energy: Math.max(0, state.energy - amount) 
  })),
  resetGame: () => set({ runId: null, day: 1, holdings: [], tradeLogs: [] }),
}));

export default useGameStore;