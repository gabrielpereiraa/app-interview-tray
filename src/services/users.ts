import { Seller } from '@/models/seller';
import api from './api';
import type { User } from '@/models/user';
import { Sale } from '@/models/sale';

export const usersService = {
  async getUsers(): Promise<User[]> {
    const response = await api.get('/users');
    return response.data.users as User[];
  },

  async getUserById(userId: number): Promise<User> {
    const response = await api.get(`/users/${userId}`);
    return response.data.user as User;
  },

  async createUser(userData: User): Promise<User> {
    const response = await api.post('/users', userData);
    return response.data.user as User;
  },

  async updateUser(userId: number, userData: User): Promise<User> {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data.user as User;
  },

  async deleteUser(userId: number): Promise<void> {
    await api.delete(`/users/${userId}`);
  },

  async getUserSellers(userId: number): Promise<Seller[]> {
    const response = await api.get(`/users/${userId}/sellers`);
    return response.data.sellers as Seller[];
  },

  async getUserSales(userId: number): Promise<Sale[]> {
    const response = await api.get(`/users/${userId}/sales`);
    return response.data.sales as Sale[];
  },
};
