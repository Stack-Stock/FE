import api from './axiosClient';

export const gameApi = {
  // 새 게임 시작
  startGame: async () => {
    const response = await api.post('/api/runs/new');
    return response.data; // StartGameResponse DTO가 반환됩니다.
  },
  // 이어하기
  continueRun: async () => {
    const response = await api.get('/api/runs/continue');
    return response.data;
  },
  // 현재 포트폴리오 조회
  getCurrentPortfolio: async () => {
    const response = await api.get('/api/runs/current/portfolio');
    return response.data;
  }
};