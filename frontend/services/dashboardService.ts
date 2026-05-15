import api from '../lib/axios';
import { ApiResponse } from './api';

export interface DashboardAggregates {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export const dashboardService = {
  getAggregates: async () => {
    const { data } = await api.get<ApiResponse<DashboardAggregates>>('/dashboard');
    return data.data;
  }
};
