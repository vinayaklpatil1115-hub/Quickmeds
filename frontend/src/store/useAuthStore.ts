import { create } from 'zustand';

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

interface AuthState {
  userInfo: UserInfo | null;
  setUserInfo: (user: UserInfo | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userInfo: typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem('userInfo') || 'null')
    : null,
  setUserInfo: (user) => {
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('userInfo', JSON.stringify(user));
      } else {
        localStorage.removeItem('userInfo');
      }
    }
    set({ userInfo: user });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userInfo');
    }
    set({ userInfo: null });
  },
}));
