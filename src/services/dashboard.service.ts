import { transactionRepository } from '../repositories/transaction.repository';

export class DashboardService {
  async getAggregates(orgId: string) {
    return transactionRepository.getAggregates(orgId);
  }
}

export const dashboardService = new DashboardService();
