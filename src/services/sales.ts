import api from './api';
import type { Sale } from '@/models/sale';

export const salesService = {
  async createSale(sale: Sale): Promise<Sale> {
    const response = await api.post(`/sales`, sale);
    return response.data.sale as Sale;
  },
  
  async updateSale(saleId: number, sale: Sale): Promise<Sale> {
    const response = await api.put(`/sales/${saleId}`, sale);
    return response.data.sale as Sale;
  },

  async getSales(): Promise<Sale[]> {
    const response = await api.get('/sales');
    return response.data.sales as Sale[];
  },

  async getSaleById(saleId: number): Promise<Sale> {
    const response = await api.get(`/sales/${saleId}`);
    return response.data.sale as Sale;
  },

  async deleteSale(saleId: number): Promise<Sale> {
    const response = await api.delete(`/sales/${saleId}`);
    return response.data as Sale;
  },
};