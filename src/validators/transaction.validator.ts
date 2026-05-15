import { z } from 'zod';

export const createTransactionSchema = z.object({
  body: z.object({
    type: z.enum(['INCOME', 'EXPENSE']),
    amount: z.number().positive(),
    category: z.string().min(1),
    description: z.string().optional(),
  }),
});

export const updateTransactionSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
    amount: z.number().positive().optional(),
    category: z.string().min(1).optional(),
    description: z.string().optional(),
  }),
});

export const listTransactionsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
    category: z.string().optional(),
  }),
});

export const transactionIdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});
