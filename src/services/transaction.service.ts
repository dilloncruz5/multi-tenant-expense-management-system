import { transactionRepository } from '../repositories/transaction.repository';
import { NotFoundError } from '../utils/errors';

export class TransactionService {
  async create(data: any, userId: string, orgId: string) {
    return transactionRepository.create({
      ...data,
      userId,
      orgId,
    });
  }

  async update(id: string, data: any, orgId: string) {
    const updated = await transactionRepository.update(id, orgId, data);
    if (!updated) {
      throw new NotFoundError('Transaction not found');
    }
    return updated;
  }

  async delete(id: string, orgId: string) {
    const deleted = await transactionRepository.delete(id, orgId);
    if (!deleted) {
      throw new NotFoundError('Transaction not found');
    }
    return deleted;
  }

  async list(orgId: string, query: any) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);
    
    return transactionRepository.list(orgId, page, limit, {
      type: query.type,
      category: query.category,
    });
  }
}

export const transactionService = new TransactionService();
