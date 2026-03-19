import api from './axiosClient';
import useGameStore from '../store/useGameStore'; // 💡 스토어 가져오기
import { demoApi } from './demoApi'; // 💡 데모 API 가져오기

export const gameApi = {
  startGame: async () => {
    if (useGameStore.getState().isDemoMode) return demoApi.startGame(); // 💡 가로채기
    const response = await api.post('/api/runs/new');
    return response.data;
  },
  continueRun: async () => {
    const response = await api.get('/api/runs/continue');
    return response.data;
  },
  getCurrentPortfolio: async () => {
    if (useGameStore.getState().isDemoMode) return demoApi.getCurrentPortfolio();
    const response = await api.get('/api/runs/current/portfolio');
    return response.data;
  },
  getDailyStart: async (runId) => {
    if (useGameStore.getState().isDemoMode) return demoApi.getDailyStart(runId);
    const response = await api.get(`/api/runs/${runId}/daily-start`);
    return response.data;
  },
  executeAction: async (actionType, stockId = null, quantity = null) => {
    const payload = { actionType };
    if (stockId !== null) payload.stockId = stockId;
    if (quantity !== null) payload.quantity = quantity;

    if (useGameStore.getState().isDemoMode) return demoApi.executeAction(payload);
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
  executeTrade: async (tradeRequest) => {
    if (useGameStore.getState().isDemoMode) return demoApi.executeTrade(tradeRequest);
    const response = await api.post('/api/trades/execute', tradeRequest);
    return response.data;
  }
};