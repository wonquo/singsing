import { create } from 'zustand';
import userService from 'services/userService';

const useLoginStore = create((set) => ({
  userId: null,
  isLogin: false,
  login: async (userId) => {
    // async 키워드 추가
    const result = await userService.getUsers({ id: userId });
    // sessionStorage에 userId 저장
    sessionStorage.setItem('userId', userId);
    sessionStorage.setItem('auth', result[0].auth);
    sessionStorage.setItem('name', result[0].name);
    set((state) => ({ userId, isLogin: true })); // eslint-disable-line
  },
  setLogout: () => set({ userId: null, isLogin: false }),
  clearIsLogin: () => set({ isLogin: false })
}));

export default useLoginStore;
