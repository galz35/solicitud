import { Request, Response, NextFunction } from 'express';
import { getConnectionPool, isUsingFallback, memoryDb, sql } from '../config/database';

export async function buscarCandidatos(req: Request, res: Response, next: NextFunction) {
  const q = (req.query.q as string || '').trim();
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  try {
    let candidatos: any[] = [];
    let totalRecords = 0;

    if (isUsingFallback()) {
      const allCands = Array.from(memoryDb.candidatos.values());
      const queryLower = q.toLowerCase();

      const filtered = allCands.filter((cand) => {
        const puestoObj = memoryDb.puestos.get(cand.candidato_id);
        const puesto = puestoObj ? puestoObj.puesto : '';
        const nombreCompleto = `${cand.pnombre} ${cand.snombre || ''} ${cand.papellido} ${cand.sapellido || ''}`.toLowerCase();

        return (
          cand.cedula.toLowerCase().includes(queryLower) ||
          nombreCompleto.includes(queryLower) ||
          puesto.toLowerCase().includes(queryLower)
        );
      });

      totalRecords = filtered.length;

      // Ordenar por fecha de solicitud desc y paginar
      const sorted = filtered.sort((a, b) => b.fecha_sol.getTime() - a.fecha_sol.getTime());
      const offset = (page - 1) * limit;
      const paginated = sorted.slice(offset, offset + limit);

      candidatos = paginated.map((cand) => {
        const puestoObj = memoryDb.puestos.get(cand.candidato_id);
        return {
          candidato_id: cand.candidato_id,
          cedula: cand.cedula,
          pnombre: cand.pnombre,
          snombre: cand.snombre,
          papellido: cand.papellido,
          sapellido: cand.sapellido,
          celular: cand.celular,
          fecha_sol: cand.fecha_sol,
          puesto: puestoObj ? puestoObj.puesto : 'No asignado',
          salario_min: puestoObj ? puestoObj.salario_min : null,
          salario_max: puestoObj ? puestoObj.salario_max : null,
        };
      });

    } else {
      const pool = await getConnectionPool();
      const result = await pool
        .request()
        .input('filtro', sql.VarChar(100), q)
        .input('page', sql.Int, page)
        .input('pageSize', sql.Int, limit)
        .output('totalRecords', sql.Int)
        .execute('sp_BuscarCandidatos');

      candidatos = result.recordset || [];
      totalRecords = result.output.totalRecords || 0;
    }

    res.status(200).json({
      status: 'success',
      data: candidatos,
      pagination: {
        total: totalRecords,
        page,
        limit,
        pages: Math.ceil(totalRecords / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}
