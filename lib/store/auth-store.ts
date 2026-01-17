import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  userId: string | null;
  isAuthenticated: boolean;
  setUserId: (userId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      isAuthenticated: false,
      setUserId: (userId) => set({ userId, isAuthenticated: true }),
      logout: () => set({ userId: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
