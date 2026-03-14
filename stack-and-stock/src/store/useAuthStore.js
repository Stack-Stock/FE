import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null, // 로그인한 유저 정보 (userId, email, nickname)
  isAuthenticated: false, // 로그인 여부

  // 로그인 성공 시 유저 정보 세팅
  login: (userData) => set({ user: userData, isAuthenticated: true }),

  // 로그아웃 시 초기화
  logout: () => set({ user: null, isAuthenticated: false }),
}));

export default useAuthStore;