import { Response, NextFunction } from 'express';
import { transactionService } from '../services/transaction.service';
import { AuthenticatedRequest } from '../types';

export const createTransaction = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { userId, orgId } = req.user!;
    const result = await transactionService.create(req.body, userId, orgId);
    res.status(201).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.user!;
    const { id } = req.params;
    const result = await transactionService.update(id, req.body, orgId);
    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.user!;
    const { id } = req.params;
    await transactionService.delete(id, orgId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const listTransactions = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.user!;
    const result = await transactionService.list(orgId, req.query);
    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
