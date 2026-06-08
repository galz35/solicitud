import { Request, Response, NextFunction } from 'express';
import { getConnectionPool, isUsingFallback, memoryDb, sql } from '../config/database';

// Helper para obtener ID de candidato por cédula
async function getCandidatoIdByCedula(cedula: string, pool?: any): Promise<number | null> {
  const cleanCedula = cedula.trim().toUpperCase();
  if (isUsingFallback()) {
    const cand = Array.from(memoryDb.candidatos.values()).find(
      (c) => c.cedula.toUpperCase() === cleanCedula
    );
    return cand ? cand.candidato_id : null;
  } else {
    const activePool = pool || (await getConnectionPool());
    const result = await activePool
      .request()
      .input('cedula', sql.VarChar(20), cleanCedula)
      .query('SELECT candidato_id FROM tbl_candidatos WHERE cedula = @cedula');
    return result.recordset.length > 0 ? result.recordset[0].candidato_id : null;
  }
}

// 1b. OBTENER PERFIL DEL CANDIDATO AUTENTICADO (por JWT)
export async function getMe(req: Request, res: Response, next: NextFunction) {
  const cedula = req.user?.cedula;

  if (!cedula) {
    res.status(401).json({ status: 'fail', message: 'No autenticado' });
    return;
  }

  try {
    if (isUsingFallback()) {
      const candidato = Array.from(memoryDb.candidatos.values()).find(
        (c) => c.cedula.toUpperCase() === cedula.toUpperCase()
      );
      if (!candidato) {
        res.status(404).json({ status: 'fail', message: 'Candidato no encontrado' });
        return;
      }
      res.status(200).json({ status: 'success', data: { candidato } });
      return;
    }

    const pool = await getConnectionPool();
    const result: any = await pool
      .request()
      .input('cedula', sql.VarChar(20), cedula.toUpperCase())
      .execute('sp_ObtenerCandidatoCompleto');

    const recordsets = result.recordsets as any[][];
    const candidato = recordsets[0][0];
    if (!candidato) {
      res.status(404).json({ status: 'fail', message: 'Candidato no encontrado' });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: {
        candidato,
        saludDeportes: recordsets[1][0] || null,
        puesto: recordsets[2][0] || null,
        emergencia: recordsets[3][0] || null,
        familiares: recordsets[4] || [],
        academicos: recordsets[5] || [],
        experiencia: recordsets[6] || [],
        referencias: recordsets[7] || [],
        idiomas: recordsets[8] || [],
      },
    });
  } catch (error) {
    next(error);
  }
}

// 1. OBTENER CANDIDATO COMPLETO
export async function getCandidato(req: Request, res: Response, next: NextFunction) {
  const { cedula } = req.params;
  const cleanCedula = cedula.trim().toUpperCase();

  try {
    if (isUsingFallback()) {
      const candidato = Array.from(memoryDb.candidatos.values()).find(
        (c) => c.cedula.toUpperCase() === cleanCedula
      );

      if (!candidato) {
        res.status(404).json({
          status: 'fail',
          message: 'Candidato no encontrado',
        });
        return;
      }

      const id = candidato.candidato_id;
      const saludDeportes = memoryDb.saludDeportes.get(id) || null;
      const puesto = memoryDb.puestos.get(id) || null;
      const emergencia = memoryDb.emergencia.get(id) || null;
      
      const familiares = memoryDb.familiares.filter((f) => f.candidato_id === id);
      const academicos = memoryDb.academicos.filter((a) => a.candidato_id === id);
      const experiencia = memoryDb.experiencia.filter((e) => e.candidato_id === id);
      const referencias = memoryDb.referencias.filter((r) => r.candidato_id === id);
      const idiomas = memoryDb.candidatoIdiomas
        .filter((ci) => ci.candidato_id === id)
        .map((ci) => {
          const idm = memoryDb.idiomas.find((i) => i.cod_idioma === ci.cod_idioma);
          return { ...ci, idioma_descripcion: idm ? idm.descripcion : 'Desconocido' };
        });

      res.status(200).json({
        status: 'success',
        data: {
          candidato,
          saludDeportes,
          puesto,
          emergencia,
          familiares,
          academicos,
          experiencia,
          referencias,
          idiomas,
        },
      });
    } else {
      const pool = await getConnectionPool();
      const result: any = await pool
        .request()
        .input('cedula', sql.VarChar(20), cleanCedula)
        .execute('sp_ObtenerCandidatoCompleto');

      const recordsets = result.recordsets as any[][];
      const candidato = recordsets[0][0];
      if (!candidato) {
        res.status(404).json({
          status: 'fail',
          message: 'Candidato no encontrado',
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        data: {
          candidato,
          saludDeportes: recordsets[1][0] || null,
          puesto: recordsets[2][0] || null,
          emergencia: recordsets[3][0] || null,
          familiares: recordsets[4] || [],
          academicos: recordsets[5] || [],
          experiencia: recordsets[6] || [],
          referencias: recordsets[7] || [],
          idiomas: recordsets[8] || [],
        },
      });
    }
  } catch (error) {
    next(error);
  }
}

// 2. GUARDAR DATOS BASE DE CANDIDATO (1:1 TABLAS)
export async function guardarCandidato(req: Request, res: Response, next: NextFunction) {
  const {
    cedula, pnombre, snombre, papellido, sapellido, fecha_nac, lugar_nac, nacionalidad,
    inss, ruc, estatura, peso, licencia, cat_licencia, vehiculo, marca, ano_vehic,
    celular, telefono_dom, departamento_dom, ciudad_dom, direccion_dom, tipo_casa,
    cuenta_banco, banco, no_cuenta, pasaporte, e_civil,
    
    penfermedad, enfermedad, palergia, alergia, tsangre, p_deporte, t_tarjeta,
    
    puesto, salario_max, salario_min, turno, obs_horario, experiencia,
    
    contacto_emer, parentesco_cont, tel_contacto
  } = req.body;

  const cleanCedula = cedula.trim().toUpperCase();

  try {
    let candidato_id: number;

    if (isUsingFallback()) {
      let cand = Array.from(memoryDb.candidatos.values()).find(
        (c) => c.cedula.toUpperCase() === cleanCedula
      );

      if (cand) {
        candidato_id = cand.candidato_id;
        // Update candidato
        Object.assign(cand, {
          pnombre, snombre, papellido, sapellido, fecha_nac, lugar_nac, nacionalidad,
          inss, ruc, estatura, peso, licencia, cat_licencia, vehiculo, marca, ano_vehic,
          celular, telefono_dom, departamento_dom, ciudad_dom, direccion_dom, tipo_casa,
          cuenta_banco, banco, no_cuenta, pasaporte, e_civil
        });
      } else {
        candidato_id = memoryDb.nextCandidatoId++;
        cand = {
          candidato_id,
          cedula: cleanCedula,
          pnombre, snombre, papellido, sapellido, fecha_nac, lugar_nac, nacionalidad,
          inss, ruc, estatura, peso, licencia, cat_licencia, vehiculo, marca, ano_vehic,
          celular, telefono_dom, departamento_dom, ciudad_dom, direccion_dom, tipo_casa,
          cuenta_banco, banco, no_cuenta, pasaporte, e_civil,
          fecha_sol: new Date()
        };
        memoryDb.candidatos.set(candidato_id, cand);
      }

      // Guardar Salud y Deportes
      memoryDb.saludDeportes.set(candidato_id, { candidato_id, penfermedad, enfermedad, palergia, alergia, tsangre, p_deporte, t_tarjeta });
      
      // Guardar Puesto
      memoryDb.puestos.set(candidato_id, { candidato_id, puesto, salario_max, salario_min, turno, obs_horario, experiencia });
      
      // Guardar Emergencia
      memoryDb.emergencia.set(candidato_id, { candidato_id, contacto_emer, parentesco_cont, tel_contacto });

    } else {
      const pool = await getConnectionPool();
      const result = await pool
        .request()
        .input('cedula', sql.VarChar(20), cleanCedula)
        .input('pnombre', sql.VarChar(50), pnombre)
        .input('snombre', sql.VarChar(50), snombre)
        .input('papellido', sql.VarChar(50), papellido)
        .input('sapellido', sql.VarChar(50), sapellido)
        .input('fecha_nac', sql.Date, fecha_nac)
        .input('lugar_nac', sql.VarChar(100), lugar_nac)
        .input('nacionalidad', sql.VarChar(50), nacionalidad)
        .input('inss', sql.VarChar(20), inss)
        .input('ruc', sql.VarChar(20), ruc)
        .input('estatura', sql.Decimal(5, 2), estatura === '' ? null : estatura)
        .input('peso', sql.Decimal(5, 2), peso === '' ? null : peso)
        .input('licencia', sql.Char(1), licencia)
        .input('cat_licencia', sql.VarChar(20), cat_licencia)
        .input('vehiculo', sql.Char(1), vehiculo)
        .input('marca', sql.VarChar(50), marca)
        .input('ano_vehic', sql.Int, ano_vehic === '' ? null : ano_vehic)
        .input('celular', sql.VarChar(20), celular)
        .input('telefono_dom', sql.VarChar(20), telefono_dom)
        .input('departamento_dom', sql.VarChar(50), departamento_dom)
        .input('ciudad_dom', sql.VarChar(50), ciudad_dom)
        .input('direccion_dom', sql.VarChar(255), direccion_dom)
        .input('tipo_casa', sql.VarChar(50), tipo_casa)
        .input('cuenta_banco', sql.Char(1), cuenta_banco)
        .input('banco', sql.VarChar(50), banco)
        .input('no_cuenta', sql.VarChar(50), no_cuenta)
        .input('pasaporte', sql.VarChar(30), pasaporte)
        .input('e_civil', sql.Char(1), e_civil)
        .input('penfermedad', sql.Char(1), penfermedad)
        .input('enfermedad', sql.VarChar(255), enfermedad)
        .input('palergia', sql.Char(1), palergia)
        .input('alergia', sql.VarChar(255), alergia)
        .input('tsangre', sql.VarChar(10), tsangre)
        .input('p_deporte', sql.VarChar(255), p_deporte)
        .input('t_tarjeta', sql.Char(1), t_tarjeta)
        .input('puesto', sql.VarChar(100), puesto)
        .input('salario_max', sql.Decimal(12, 2), salario_max === '' ? null : salario_max)
        .input('salario_min', sql.Decimal(12, 2), salario_min === '' ? null : salario_min)
        .input('turno', sql.VarChar(50), turno)
        .input('obs_horario', sql.VarChar(255), obs_horario)
        .input('experiencia', sql.VarChar(sql.MAX), experiencia)
        .input('contacto_emer', sql.VarChar(100), contacto_emer)
        .input('parentesco_cont', sql.VarChar(50), parentesco_cont)
        .input('tel_contacto', sql.VarChar(20), tel_contacto)
        .output('candidato_id', sql.Int)
        .execute('sp_GuardarCandidato');

      candidato_id = result.output.candidato_id;
    }

    res.status(200).json({
      status: 'success',
      message: 'Candidato guardado exitosamente',
      candidato_id,
    });
  } catch (error) {
    next(error);
  }
}


// ============================================================================
// CRUD SUB-ENTIDADES
// ============================================================================

// 3. DATOS FAMILIARES
export async function guardarFamiliar(req: Request, res: Response, next: NextFunction) {
  const { cedula } = req.params;
  const { id_df, nombre, parentesco, l_trabajo, direccion } = req.body;

  try {
    const candidato_id = await getCandidatoIdByCedula(cedula);
    if (!candidato_id) {
      res.status(404).json({ status: 'fail', message: 'Candidato no encontrado.' });
      return;
    }

    let resultId: number;

    if (isUsingFallback()) {
      if (id_df) {
        const idx = memoryDb.familiares.findIndex((f) => f.id_df === id_df);
        if (idx !== -1) {
          memoryDb.familiares[idx] = { id_df, candidato_id, nombre, parentesco, l_trabajo, direccion };
        }
        resultId = id_df;
      } else {
        resultId = memoryDb.nextFamiliarId++;
        memoryDb.familiares.push({ id_df: resultId, candidato_id, nombre, parentesco, l_trabajo, direccion });
      }
    } else {
      const pool = await getConnectionPool();
      const result = await pool
        .request()
        .input('candidato_id', sql.Int, candidato_id)
        .input('nombre', sql.VarChar(100), nombre)
        .input('parentesco', sql.VarChar(50), parentesco)
        .input('l_trabajo', sql.VarChar(100), l_trabajo)
        .input('direccion', sql.VarChar(255), direccion)
        .output('id_df', sql.Int, id_df || null)
        .execute('sp_GuardarFamiliar');
      
      resultId = result.output.id_df;
    }

    res.status(200).json({ status: 'success', message: 'Familiar guardado', id_df: resultId });
  } catch (error) {
    next(error);
  }
}

export async function eliminarFamiliar(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  const numId = parseInt(id, 10);

  try {
    if (isUsingFallback()) {
      memoryDb.familiares = memoryDb.familiares.filter((f) => f.id_df !== numId);
    } else {
      const pool = await getConnectionPool();
      await pool.request().input('id_df', sql.Int, numId).execute('sp_EliminarFamiliar');
    }
    res.status(200).json({ status: 'success', message: 'Familiar eliminado' });
  } catch (error) {
    next(error);
  }
}


// 4. DATOS ACADÉMICOS
export async function guardarAcademico(req: Request, res: Response, next: NextFunction) {
  const { cedula } = req.params;
  const { id_da, nivel_academico, titulo, estado, ult_ano_aprob, institucion, duracion } = req.body;

  try {
    const candidato_id = await getCandidatoIdByCedula(cedula);
    if (!candidato_id) {
      res.status(404).json({ status: 'fail', message: 'Candidato no encontrado.' });
      return;
    }

    let resultId: number;

    if (isUsingFallback()) {
      if (id_da) {
        const idx = memoryDb.academicos.findIndex((a) => a.id_da === id_da);
        if (idx !== -1) {
          memoryDb.academicos[idx] = { id_da, candidato_id, nivel_academico, titulo, estado, ult_ano_aprob, institucion, duracion };
        }
        resultId = id_da;
      } else {
        resultId = memoryDb.nextAcademicoId++;
        memoryDb.academicos.push({ id_da: resultId, candidato_id, nivel_academico, titulo, estado, ult_ano_aprob, institucion, duracion });
      }
    } else {
      const pool = await getConnectionPool();
      const result = await pool
        .request()
        .input('candidato_id', sql.Int, candidato_id)
        .input('nivel_academico', sql.VarChar(2), nivel_academico)
        .input('titulo', sql.VarChar(150), titulo)
        .input('estado', sql.VarChar(50), estado)
        .input('ult_ano_aprob', sql.Int, ult_ano_aprob)
        .input('institucion', sql.VarChar(150), institucion)
        .input('duracion', sql.VarChar(50), duracion)
        .output('id_da', sql.Int, id_da || null)
        .execute('sp_GuardarAcademico');
      
      resultId = result.output.id_da;
    }

    res.status(200).json({ status: 'success', message: 'Dato académico guardado', id_da: resultId });
  } catch (error) {
    next(error);
  }
}

export async function eliminarAcademico(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  const numId = parseInt(id, 10);

  try {
    if (isUsingFallback()) {
      memoryDb.academicos = memoryDb.academicos.filter((a) => a.id_da !== numId);
    } else {
      const pool = await getConnectionPool();
      await pool.request().input('id_da', sql.Int, numId).execute('sp_EliminarAcademico');
    }
    res.status(200).json({ status: 'success', message: 'Dato académico eliminado' });
  } catch (error) {
    next(error);
  }
}


// 5. EXPERIENCIA PROFESIONAL
export async function guardarExperiencia(req: Request, res: Response, next: NextFunction) {
  const { cedula } = req.params;
  const { id_ep, empresa, giro, cargo, jefe_inmediato, f_ingreso, f_salida, motivo_salida } = req.body;

  try {
    const candidato_id = await getCandidatoIdByCedula(cedula);
    if (!candidato_id) {
      res.status(404).json({ status: 'fail', message: 'Candidato no encontrado.' });
      return;
    }

    let resultId: number;

    if (isUsingFallback()) {
      if (id_ep) {
        const idx = memoryDb.experiencia.findIndex((e) => e.id_ep === id_ep);
        if (idx !== -1) {
          memoryDb.experiencia[idx] = { id_ep, candidato_id, empresa, giro, cargo, jefe_inmediato, f_ingreso, f_salida, motivo_salida };
        }
        resultId = id_ep;
      } else {
        resultId = memoryDb.nextExperienciaId++;
        memoryDb.experiencia.push({ id_ep: resultId, candidato_id, empresa, giro, cargo, jefe_inmediato, f_ingreso, f_salida, motivo_salida });
      }
    } else {
      const pool = await getConnectionPool();
      const result = await pool
        .request()
        .input('candidato_id', sql.Int, candidato_id)
        .input('empresa', sql.VarChar(100), empresa)
        .input('giro', sql.VarChar(100), giro)
        .input('cargo', sql.VarChar(100), cargo)
        .input('jefe_inmediato', sql.VarChar(100), jefe_inmediato)
        .input('f_ingreso', sql.Date, f_ingreso ? new Date(f_ingreso) : null)
        .input('f_salida', sql.Date, f_salida ? new Date(f_salida) : null)
        .input('motivo_salida', sql.VarChar(255), motivo_salida)
        .output('id_ep', sql.Int, id_ep || null)
        .execute('sp_GuardarExperiencia');
      
      resultId = result.output.id_ep;
    }

    res.status(200).json({ status: 'success', message: 'Experiencia profesional guardada', id_ep: resultId });
  } catch (error) {
    next(error);
  }
}

export async function eliminarExperiencia(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  const numId = parseInt(id, 10);

  try {
    if (isUsingFallback()) {
      memoryDb.experiencia = memoryDb.experiencia.filter((e) => e.id_ep !== numId);
    } else {
      const pool = await getConnectionPool();
      await pool.request().input('id_ep', sql.Int, numId).execute('sp_EliminarExperiencia');
    }
    res.status(200).json({ status: 'success', message: 'Experiencia profesional eliminada' });
  } catch (error) {
    next(error);
  }
}


// 6. REFERENCIAS
export async function guardarReferencia(req: Request, res: Response, next: NextFunction) {
  const { cedula } = req.params;
  const { id_ref, nombre_completo, direccion, empresa, edad, telefono, tipo_relacion, interno } = req.body;

  try {
    const candidato_id = await getCandidatoIdByCedula(cedula);
    if (!candidato_id) {
      res.status(404).json({ status: 'fail', message: 'Candidato no encontrado.' });
      return;
    }

    let resultId: number;

    if (isUsingFallback()) {
      if (id_ref) {
        const idx = memoryDb.referencias.findIndex((r) => r.id_ref === id_ref);
        if (idx !== -1) {
          memoryDb.referencias[idx] = { id_ref, candidato_id, nombre_completo, direccion, empresa, edad, telefono, tipo_relacion, interno };
        }
        resultId = id_ref;
      } else {
        resultId = memoryDb.nextReferenciaId++;
        memoryDb.referencias.push({ id_ref: resultId, candidato_id, nombre_completo, direccion, empresa, edad, telefono, tipo_relacion, interno });
      }
    } else {
      const pool = await getConnectionPool();
      const result = await pool
        .request()
        .input('candidato_id', sql.Int, candidato_id)
        .input('nombre_completo', sql.VarChar(100), nombre_completo)
        .input('direccion', sql.VarChar(255), direccion)
        .input('empresa', sql.VarChar(100), empresa)
        .input('edad', sql.Int, edad)
        .input('telefono', sql.VarChar(20), telefono)
        .input('tipo_relacion', sql.VarChar(50), tipo_relacion)
        .input('interno', sql.Char(1), interno)
        .output('id_ref', sql.Int, id_ref || null)
        .execute('sp_GuardarReferencia');
      
      resultId = result.output.id_ref;
    }

    res.status(200).json({ status: 'success', message: 'Referencia guardada', id_ref: resultId });
  } catch (error) {
    next(error);
  }
}

export async function eliminarReferencia(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  const numId = parseInt(id, 10);

  try {
    if (isUsingFallback()) {
      memoryDb.referencias = memoryDb.referencias.filter((r) => r.id_ref !== numId);
    } else {
      const pool = await getConnectionPool();
      await pool.request().input('id_ref', sql.Int, numId).execute('sp_EliminarReferencia');
    }
    res.status(200).json({ status: 'success', message: 'Referencia eliminada' });
  } catch (error) {
    next(error);
  }
}


// 7. IDIOMAS DEL CANDIDATO
export async function guardarIdioma(req: Request, res: Response, next: NextFunction) {
  const { cedula } = req.params;
  const { cod_idioma, n_lectura, n_escritura, n_conversacion } = req.body;

  try {
    const candidato_id = await getCandidatoIdByCedula(cedula);
    if (!candidato_id) {
      res.status(404).json({ status: 'fail', message: 'Candidato no encontrado.' });
      return;
    }

    if (isUsingFallback()) {
      const idx = memoryDb.candidatoIdiomas.findIndex(
        (ci) => ci.candidato_id === candidato_id && ci.cod_idioma === cod_idioma
      );
      if (idx !== -1) {
        memoryDb.candidatoIdiomas[idx] = { candidato_id, cod_idioma, n_lectura, n_escritura, n_conversacion };
      } else {
        memoryDb.candidatoIdiomas.push({ candidato_id, cod_idioma, n_lectura, n_escritura, n_conversacion });
      }
    } else {
      const pool = await getConnectionPool();
      await pool
        .request()
        .input('candidato_id', sql.Int, candidato_id)
        .input('cod_idioma', sql.Int, cod_idioma)
        .input('n_lectura', sql.Int, n_lectura)
        .input('n_escritura', sql.Int, n_escritura)
        .input('n_conversacion', sql.Int, n_conversacion)
        .execute('sp_GuardarCandidatoIdioma');
    }

    res.status(200).json({ status: 'success', message: 'Idioma guardado exitosamente.' });
  } catch (error) {
    next(error);
  }
}

export async function eliminarIdioma(req: Request, res: Response, next: NextFunction) {
  const { cedula, cod_idioma } = req.params;
  const numCodIdioma = parseInt(cod_idioma, 10);

  try {
    const candidato_id = await getCandidatoIdByCedula(cedula);
    if (!candidato_id) {
      res.status(404).json({ status: 'fail', message: 'Candidato no encontrado.' });
      return;
    }

    if (isUsingFallback()) {
      memoryDb.candidatoIdiomas = memoryDb.candidatoIdiomas.filter(
        (ci) => !(ci.candidato_id === candidato_id && ci.cod_idioma === numCodIdioma)
      );
    } else {
      const pool = await getConnectionPool();
      await pool
        .request()
        .input('candidato_id', sql.Int, candidato_id)
        .input('cod_idioma', sql.Int, numCodIdioma)
        .execute('sp_EliminarCandidatoIdioma');
    }
    res.status(200).json({ status: 'success', message: 'Idioma del candidato eliminado' });
  } catch (error) {
    next(error);
  }
}
