import { Response, NextFunction } from 'express';
import { dashboardService } from '../services/dashboard.service';
import { AuthenticatedRequest } from '../types';

export const getDashboard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.user!;
    const result = await dashboardService.getAggregates(orgId);
    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
