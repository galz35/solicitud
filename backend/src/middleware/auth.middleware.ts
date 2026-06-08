import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sel3Rh2026_super_secret_token_key_for_authentication';

export function protect(req: Request, res: Response, next: NextFunction) {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({
      status: 'fail',
      message: 'No está autorizado para acceder a este recurso. Falta el token.',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      cedula: string;
      candidato_id?: number;
      email?: string;
      method?: string;
      rol?: 'admin' | 'candidato';
    };

    req.user = {
      cedula: decoded.cedula,
      candidato_id: decoded.candidato_id,
      email: decoded.email,
      method: decoded.method,
      rol: decoded.rol || 'candidato',
    };

    next();
  } catch (error) {
    res.status(401).json({
      status: 'fail',
      message: 'Token inválido o expirado.',
    });
  }
}

// Middleware para restringir acceso según roles (ej. solo 'admin' puede usar buscar.asp)
export function restrictTo(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.rol || !roles.includes(req.user.rol)) {
      res.status(403).json({
        status: 'fail',
        message: 'No tiene permisos para realizar esta acción.',
      });
      return;
    }
    next();
  };
}
