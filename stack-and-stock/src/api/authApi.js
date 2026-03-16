import api from './axiosClient';

export const authApi = {
  // 로그인
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },
  // 내 정보 조회
  getMe: async () => {
    const response = await api.get('/api/users/me');
    return response.data;
  },
  // 회원가입
  signup: async (email, password, nickname) => {
    const response = await api.post('/api/auth/signup', { email, password, nickname });
    return response.data;
  }
};