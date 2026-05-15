import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';
import { ZodError } from 'zod';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.warn({ err }, 'Operational error occurred');
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    logger.warn({ err }, 'Validation error');
    return res.status(400).json({
      status: 'error',
      message: 'Validation Error',
      errors: err.errors,
    });
  }

  logger.error({ err }, 'Unexpected error occurred');
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};
