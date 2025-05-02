import api from './api';
import type { Seller } from '@/models/seller';

export const sellersService = {
  async getSellers(): Promise<Seller[]> {
    const response = await api.get('/sellers');
    return response.data.sellers as Seller[];
  },

  async getSellerById(sellerId: number): Promise<Seller> {
    const response = await api.get(`/sellers/${sellerId}`);
    return response.data.seller as Seller;
  },

  async createSeller(sellerData: any): Promise<Seller> {
    const response = await api.post('/sellers', sellerData);
    return response.data.seller as Seller;
  },

  async updateSeller(sellerId: number, sellerData: any): Promise<Seller> {
    const response = await api.put(`/sellers/${sellerId}`, sellerData);
    return response.data.seller as Seller;
  },

  async deleteSeller(sellerId: number): Promise<boolean> {
    await api.delete(`/sellers/${sellerId}`);
    return true;
  },

  async getSellerSales(sellerId: number): Promise<any[]> {
    const response = await api.get(`/sellers/${sellerId}/sales`);
    return response.data.sales;
  },

  async createSellerSale(sellerId: number, saleData: any): Promise<any> {
    const response = await api.post(`/sellers/${sellerId}/sales`, saleData);
    return response.data.sale;
  },

  async updateSellerSale(sellerId: number, saleId: number, saleData: any): Promise<any> {
    const response = await api.put(`/sellers/${sellerId}/sales/${saleId}`, saleData);
    return response.data.sale;
  },
};