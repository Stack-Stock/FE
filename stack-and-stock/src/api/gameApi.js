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
  getDailyStart: async (runId) => {
    const response = await api.get(`/api/runs/${runId}/daily-start`);
    return response.data;
  },
  executeAction: async (actionType, stockId = null, quantity = null) => {
    const payload = { actionType };
    if (stockId !== null) payload.stockId = stockId;
    if (quantity !== null) payload.quantity = quantity;

    const response = await api.post('/api/actions', payload);
    return response.data;
  },
  triggerPoliceEvent: async (runId, currentDayNo) => {
    const payload = { runId, currentDayNo };
    const response = await api.post('/api/scenarios/police', payload);
    return response.data;
  },
  triggerGuiltyEvent: async (runId, currentDayNo) => {
    const payload = { runId, currentDayNo };
    const response = await api.post('/api/scenarios/guilty', payload);
    return response.data;
  },
  
  // 💡 [신규] 다중 주식 거래 체결 (장바구니 방식)
  executeTrade: async (tradeRequest) => {
    // tradeRequest 형태: { orders: [ { stockId: 3, side: 'BUY', quantity: 10 }, ... ] }
    const response = await api.post('/api/trades/execute', tradeRequest);
    return response.data;
  }
};