import { defineStore } from 'pinia';
import type { Sale } from '@/models/sale';
import { salesService } from '@/services/sales';

export const useSalesStore = defineStore('sales', {
  state: () => ({
    sales: [] as Sale[],
  }),
  actions: {
    async createSale(sale: Sale): Promise<Sale> {
       try {
        const newSale = await salesService.createSale(sale);
        this.sales.push(newSale);
        return newSale
       } catch (error) {
        console.error('Error creating sale:', error);
        throw error;
      }
    },
    async getSales(): Promise<Sale[]> {
      try {
        const response = await salesService.getSales();
        this.sales = response;
        return response;
      } catch (error) {
        console.error('Error fetching sales:', error);
        throw error;
      }
    },
    async getSaleById(saleId: number): Promise<Sale> {
      try {
        return await salesService.getSaleById(saleId);
      } catch (error) {
        console.error('Error getting sale by ID:', error);
        throw error;
      }
    },
    async updateSale(saleId: number, updatedSale: any): Promise<Sale> {
      return await salesService.updateSale(saleId, updatedSale);
    },
     async deleteSale(saleId: number) {
      try {
        await salesService.deleteSale(saleId);
        this.sales = this.sales.filter((sale: Sale) => sale.id !== saleId);
      } catch (error) {
        console.error('Error deleting sale:', error);
        throw error;
      }
    },
    clearSales() {
      this.sales = [];
    }
  },
});