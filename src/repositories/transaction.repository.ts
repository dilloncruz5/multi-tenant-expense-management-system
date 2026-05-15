import prisma from '../prisma/client';
import { Prisma, Transaction } from '@prisma/client';
import { PaginatedResult } from '../types';

export class TransactionRepository {
  async create(data: Prisma.TransactionUncheckedCreateInput): Promise<Transaction> {
    return prisma.transaction.create({ data });
  }

  async findById(id: string, orgId: string): Promise<Transaction | null> {
    return prisma.transaction.findFirst({
      where: { id, orgId },
    });
  }

  async update(id: string, orgId: string, data: Prisma.TransactionUncheckedUpdateInput): Promise<Transaction | null> {
    const existing = await this.findById(id, orgId);
    if (!existing) return null;

    return prisma.transaction.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, orgId: string): Promise<boolean> {
    const existing = await this.findById(id, orgId);
    if (!existing) return false;

    await prisma.transaction.delete({ where: { id } });
    return true;
  }

  async list(
    orgId: string,
    page: number = 1,
    limit: number = 10,
    filters?: { type?: 'INCOME' | 'EXPENSE'; category?: string }
  ): Promise<PaginatedResult<Transaction>> {
    const skip = (page - 1) * limit;

    const where: Prisma.TransactionWhereInput = {
      orgId,
      ...(filters?.type && { type: filters.type }),
      ...(filters?.category && { category: { contains: filters.category, mode: 'insensitive' } }),
    };

    const [total, data] = await Promise.all([
      prisma.transaction.count({ where }),
      prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAggregates(orgId: string) {
    const result = await prisma.transaction.groupBy({
      by: ['type'],
      where: { orgId },
      _sum: { amount: true },
    });

    const aggregates = {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
    };

    for (const row of result) {
      const amount = Number(row._sum.amount || 0);
      if (row.type === 'INCOME') {
        aggregates.totalIncome = amount;
      } else if (row.type === 'EXPENSE') {
        aggregates.totalExpense = amount;
      }
    }

    aggregates.balance = aggregates.totalIncome - aggregates.totalExpense;

    return aggregates;
  }
}

export const transactionRepository = new TransactionRepository();
