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
  // 💡 [신규] 3일 뒤 경찰 출두 이벤트 예약
  triggerPoliceEvent: async (runId, currentDayNo) => {
    const payload = { runId, currentDayNo };
    const response = await api.post('/api/scenarios/police', payload);
    return response.data;
  },
  // 💡 [신규] 1일, 2일 뒤 죄책감(기운 없음) 이벤트 예약
  triggerGuiltyEvent: async (runId, currentDayNo) => {
    const payload = { runId, currentDayNo };
    const response = await api.post('/api/scenarios/guilty', payload);
    return response.data;
  }
};