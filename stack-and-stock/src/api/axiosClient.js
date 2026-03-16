import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // 백엔드 주소
  withCredentials: true, // 💡 [핵심] 세션 쿠키를 백엔드와 자동으로 공유합니다!
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;