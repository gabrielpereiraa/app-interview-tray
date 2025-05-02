import { defineStore } from 'pinia';
import { User, defaultUser } from '@/models/user';
import { authService } from '@/services/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    user: { ...defaultUser },
  }),
  persist: {
    storage: localStorage,
  },
  getters: {
    isAuthenticated: (state) => state.token !== '',
  },
  actions: {
    async login(token: string) {
      this.token = token;
    },
    async logout() {
      this.token = '';
      this.expires_in = '';
      this.clearUser();
      localStorage.clear();
    },
    setToken(token: string) {
      this.token = token;
    },
    setUser(user: User) {
      this.user = { ...user };
    },
    clearUser() {
      this.user = { ...defaultUser };
    },
    async checkAuth() {
      if (this.token) {
        try {
          const response = await authService.me();
          this.setUser(response);
          return true;
        } catch (error) {
          this.logout();
          return false;
        }
      } else {
        this.logout();
        return false;
      }
    },
  },
});
