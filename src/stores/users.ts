import { defineStore } from 'pinia';
import type { User } from '@/models/user';
import { usersService } from '@/services/users';

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [] as User[],
  }),
  actions: {
    async createUser(user: User): Promise<User> {
      try {
        const createdUser = await usersService.createUser(user);
        this.users.push(createdUser);
        return createdUser;
      } catch (error) {
        console.error('Error creating user:', error);
        throw error;
      }
    },
    async getUsers(): Promise<User[]> {
      try {
        const users = await usersService.getUsers();
        this.users = users;
        return users;
      } catch (error) {
        console.error('Error getting users:', error);
        throw error;
      }
    },
    async getUserById(userId: number): Promise<User> {
      try {
        return await usersService.getUserById(userId);
      } catch (error) {
        console.error('Error getting user by id:', error);
        throw error;
      }
    },
    async updateUser(userId: number, user: User): Promise<User> {
      const response = await usersService.updateUser(userId, user);
      await this.getUsers()
      return response;
    },
    async deleteUser(userId: number): Promise<boolean> {
      await usersService.deleteUser(userId);
      await this.getUsers()
      this.users = this.users.filter((user: User) => user.id !== userId);
      return true;
    },
    clearUsers() {
      this.users = [];
    },
  },
});