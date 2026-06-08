import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  errors?: any;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';
  
  console.error(`[ERROR] [${req.method}] ${req.url}:`, {
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    errors: err.errors,
  });

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    errors: err.errors || null,
  });
}
