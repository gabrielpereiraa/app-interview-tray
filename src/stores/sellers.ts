import { defineStore } from 'pinia';
import type { Seller } from '@/models/seller';
import { sellersService } from '@/services/sellers';

export const useSellersStore = defineStore('sellers', {
  state: () => ({
    sellers: [] as Seller[],
  }),
  actions: {
    async createSeller(seller: Seller): Promise<Seller> {
      const response = await sellersService.createSeller(seller);
      this.sellers.push(response);
      return response;
    },
    async getSellers(): Promise<Seller[]> {
      const response = await sellersService.getSellers();
      this.sellers = response;
      return response;
    },
    async getSellerById(sellerId: number): Promise<Seller> {
      return await sellersService.getSellerById(sellerId);
    },
    async updateSeller(sellerId: number, updatedSeller: Seller): Promise<Seller> {
      const response = await sellersService.updateSeller(sellerId, updatedSeller);
      const index = this.sellers.findIndex((seller: Seller) => seller.id === sellerId);
      if (index !== -1) {
        this.sellers[index] = response;
      }
      return response;
    },
    async deleteSeller(sellerId: number): Promise<boolean> {
      await sellersService.deleteSeller(sellerId);
      this.sellers = this.sellers.filter((seller: Seller) => seller.id !== sellerId);
      return true;
    },
    clearSellers() {
      this.sellers = [];
    },
  },
});
