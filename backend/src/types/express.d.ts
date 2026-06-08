import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        cedula: string;
        candidato_id?: number;
        email?: string;
        method?: string;
        rol?: 'admin' | 'candidato';
      };
    }
  }
}
