import { Request, Response, NextFunction } from 'express';
import { getConnectionPool, isUsingFallback, memoryDb } from '../config/database';

export async function getIdiomas(req: Request, res: Response, next: NextFunction) {
  try {
    let idiomas = [];
    if (isUsingFallback()) {
      idiomas = memoryDb.idiomas;
    } else {
      const pool = await getConnectionPool();
      const result = await pool.request().query('SELECT cod_idioma, descripcion FROM tbl_idiomas ORDER BY descripcion');
      idiomas = result.recordset;
    }
    
    res.status(200).json({
      status: 'success',
      results: idiomas.length,
      data: idiomas,
    });
  } catch (error) {
    next(error);
  }
}

export function getNacionalidades(req: Request, res: Response) {
  const nacionalidades = [
    'Nicaragüense',
    'Costarricense',
    'Hondureña',
    'Salvadoreña',
    'Guatemalteca',
    'Panameña',
    'Estadounidense',
    'Mexicana',
    'Otra',
  ];
  res.status(200).json({ status: 'success', data: nacionalidades });
}

export function getNivelesAcademicos(req: Request, res: Response) {
  const niveles = [
    { codigo: 'P', descripcion: 'Primaria' },
    { codigo: 'S', descripcion: 'Secundaria' },
    { codigo: 'T', descripcion: 'Técnico Medio/Superior' },
    { codigo: 'U', descripcion: 'Universidad' },
    { codigo: 'Pg', descripcion: 'Postgrado' },
    { codigo: 'M', descripcion: 'Maestría' },
    { codigo: 'D', descripcion: 'Doctorado' },
  ];
  res.status(200).json({ status: 'success', data: niveles });
}

export function getEstadosCiviles(req: Request, res: Response) {
  const estados = [
    { codigo: 'S', descripcion: 'Soltero(a)' },
    { codigo: 'C', descripcion: 'Casado(a)' },
    { codigo: 'V', descripcion: 'Viudo(a)' },
    { codigo: 'D', descripcion: 'Divorciado(a)' },
    { codigo: 'A', descripcion: 'Acompañado(a)' },
  ];
  res.status(200).json({ status: 'success', data: estados });
}

export function getTiposSangre(req: Request, res: Response) {
  const tipos = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'No Sabe'];
  res.status(200).json({ status: 'success', data: tipos });
}
