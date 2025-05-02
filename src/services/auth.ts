import { User } from '@/models/user';
import api from './api';

export const authService = {
  async login(email: string, password: string) {
    try {
      const response = await api.post('/login', { email, password });
      return {
        ...response.data,
        token: response.data.token
      };
    } catch (error) {
      throw error;
    }
  },

  async logout() {
    await api.post('/logout');
  },

  async me(): Promise<User> {
    try {
      const response = await api.get('/me');
      return response.data as User;
    } catch (error) {
      throw error;
    }
  },
};
