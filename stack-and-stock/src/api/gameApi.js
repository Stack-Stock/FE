import api from './axiosClient';

export const gameApi = {
  startGame: async () => {
    const response = await api.post('/api/runs/new');
    return response.data;
  },
  continueRun: async () => {
    const response = await api.get('/api/runs/continue');
    return response.data;
  },
  getCurrentPortfolio: async () => {
    const response = await api.get('/api/runs/current/portfolio');
    return response.data;
  },
  // 💡 [신규] 하루 시작 데이터 가져오기 (수면 직후 호출)
  getDailyStart: async (runId) => {
    const response = await api.get(`/api/runs/${runId}/daily-start`);
    return response.data;
  },
  // 💡 [신규] 만능 행동 실행 API (수면, 공부, 주식 거래 등 모두 이거 하나로 끝!)
  executeAction: async (actionType, stockId = null, quantity = null) => {
    const payload = { actionType };
    if (stockId !== null) payload.stockId = stockId;
    if (quantity !== null) payload.quantity = quantity;

    const response = await api.post('/api/actions', payload);
    return response.data; // ActionResultResponse 반환
  }
};