import api from '../lib/axios';
import { ApiResponse, PaginatedResult } from './api';

export interface Transaction {
  id: string;
  orgId: string;
  userId: string;
  type: 'INCOME' | 'EXPENSE';
  amount: string | number;
  category: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export const transactionService = {
  list: async (params: { page?: number; limit?: number; type?: string; category?: string }) => {
    const { data } = await api.get<ApiResponse<PaginatedResult<Transaction>>>('/transactions', { params });
    return data.data;
  },

  create: async (payload: Partial<Transaction>) => {
    const { data } = await api.post<ApiResponse<Transaction>>('/transactions', payload);
    return data.data;
  },

  update: async (id: string, payload: Partial<Transaction>) => {
    const { data } = await api.put<ApiResponse<Transaction>>(`/transactions/${id}`, payload);
    return data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/transactions/${id}`);
  }
};
