import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getConnectionPool, isUsingFallback, memoryDb, sql } from '../config/database';

const JWT_SECRET = process.env.JWT_SECRET || 'sel3Rh2026_super_secret_token_key_for_authentication';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';

// Cédula mágica para administrador
const ADMIN_CEDULA = '0000000000000A';

export async function login(req: Request, res: Response, next: NextFunction) {
  const { cedula } = req.body;
  const cleanCedula = cedula.trim().toUpperCase();

  try {
    let rol: 'admin' | 'candidato' = 'candidato';
    let existe = false;

    // Verificar si es administrador
    if (cleanCedula === ADMIN_CEDULA) {
      rol = 'admin';
      existe = true;
    } else {
      if (isUsingFallback()) {
        // Buscar en base de datos en memoria
        existe = Array.from(memoryDb.candidatos.values()).some(
          (cand) => cand.cedula.toUpperCase() === cleanCedula
        );
      } else {
        // Buscar en SQL Server
        const pool = await getConnectionPool();
        const result = await pool
          .request()
          .input('cedula', sql.VarChar(20), cleanCedula)
          .query('SELECT candidato_id FROM tbl_candidatos WHERE cedula = @cedula');
        
        existe = (result.recordset.length > 0);
      }
    }

    // Firmar token JWT
    const token = jwt.sign({ cedula: cleanCedula, rol }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(200).json({
      status: 'success',
      token,
      candidato: {
        cedula: cleanCedula,
        rol,
        existe, // Si es false, el frontend sabe que debe inicializar el Wizard desde cero
      },
    });
  } catch (error) {
    next(error);
  }
}
