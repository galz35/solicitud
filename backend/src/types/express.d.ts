import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        cedula: string;
        rol?: 'admin' | 'candidato';
      };
    }
  }
}
