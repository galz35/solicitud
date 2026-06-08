import { Request, Response, NextFunction } from 'express';
import { getConnectionPool, isUsingFallback, memoryDb, sql } from '../config/database';

export async function buscarCandidatos(req: Request, res: Response, next: NextFunction) {
  const q = (req.query.q as string || '').trim();
  const mes = (req.query.mes as string || '').trim();
  const puesto = (req.query.puesto as string || '').trim();
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 15;

  try {
    let candidatos: any[] = [];
    let totalRecords = 0;

    if (isUsingFallback()) {
      const allCands = Array.from(memoryDb.candidatos.values());
      const queryLower = q.toLowerCase();

      const filtered = allCands.filter((cand) => {
        const puestoObj = memoryDb.puestos.get(cand.candidato_id);
        const puestoNombre = puestoObj ? puestoObj.puesto : '';

        const matchBusqueda = !q || cand.cedula.toLowerCase().includes(queryLower) ||
          `${cand.pnombre} ${cand.snombre || ''} ${cand.papellido} ${cand.sapellido || ''}`.toLowerCase().includes(queryLower) ||
          puestoNombre.toLowerCase().includes(queryLower);

        const matchPuesto = !puesto || puestoNombre.toLowerCase().includes(puesto.toLowerCase());

        const matchMes = !mes || (cand.fecha_sol && cand.fecha_sol.toISOString().startsWith(mes));

        return matchBusqueda && matchPuesto && matchMes;
      });

      totalRecords = filtered.length;
      const sorted = filtered.sort((a, b) => b.fecha_sol.getTime() - a.fecha_sol.getTime());
      const offset = (page - 1) * limit;
      const paginated = sorted.slice(offset, offset + limit);

      candidatos = paginated.map((cand) => {
        const puestoObj = memoryDb.puestos.get(cand.candidato_id);
        return {
          candidato_id: cand.candidato_id,
          cedula: cand.cedula, pnombre: cand.pnombre, snombre: cand.snombre,
          papellido: cand.papellido, sapellido: cand.sapellido, celular: cand.celular,
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
        .input('mes', sql.VarChar(7), mes || null)
        .input('puesto_filtro', sql.VarChar(100), puesto || null)
        .output('totalRecords', sql.Int)
        .execute('sp_BuscarCandidatos');

      candidatos = result.recordset || [];
      totalRecords = result.output.totalRecords || 0;
    }

    res.status(200).json({
      status: 'success',
      data: candidatos,
      pagination: { total: totalRecords, page, limit, pages: Math.ceil(totalRecords / limit) },
    });
  } catch (error) {
    next(error);
  }
}

// ==========================================
// EXPORTAR CANDIDATOS A CSV
// ==========================================
export async function exportarCandidatos(req: Request, res: Response, next: NextFunction) {
  const q = (req.query.q as string || '').trim();

  try {
    if (isUsingFallback()) {
      res.status(503).json({ status: 'fail', message: 'Base de datos no disponible' });
      return;
    }

    const pool = await getConnectionPool();
    const result = await pool
      .request()
      .input('filtro', sql.VarChar(100), q)
      .input('page', sql.Int, 1)
      .input('pageSize', sql.Int, 999999)
      .output('totalRecords', sql.Int)
      .execute('sp_BuscarCandidatos');

    const candidatos = result.recordset || [];
    const totalRecords = result.output.totalRecords || 0;

    // Construir CSV manualmente (sin dependencias externas)
    const headers = [
      'Cédula',
      'Primer Nombre',
      'Segundo Nombre',
      'Primer Apellido',
      'Segundo Apellido',
      'Celular',
      'Correo',
      'Puesto',
      'Salario Mínimo',
      'Salario Máximo',
      'Fecha Registro',
    ];

    const safe = (v: any) => {
      if (v === null || v === undefined) return '';
      const s = String(v).replace(/"/g, '""');
      return `"${s}"`;
    };

    let csv = '\uFEFF'; // BOM UTF-8
    csv += headers.join(',') + '\n';

    for (const c of candidatos) {
      const fila = [
        safe(c.cedula),
        safe(c.pnombre),
        safe(c.snombre),
        safe(c.papellido),
        safe(c.sapellido),
        safe(c.celular),
        safe(c.correo || ''),
        safe(c.puesto),
        safe(c.salario_min),
        safe(c.salario_max),
        safe(c.fecha_sol ? new Date(c.fecha_sol).toLocaleDateString('es-NI') : ''),
      ];
      csv += fila.join(',') + '\n';
    }

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="candidatos.csv"');
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
}
