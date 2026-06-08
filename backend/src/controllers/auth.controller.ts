import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { getConnectionPool, isUsingFallback, memoryDb, sql } from '../config/database';

const JWT_SECRET = process.env.JWT_SECRET || 'sel3Rh2026_super_secret_token_key_for_authentication';
const SSO_SECRET = process.env.SSO_SECRET || 'ClaroSSO_Shared_Secret_2026_!#';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '2h';

// ==========================================
// LOGIN POR CÉDULA 
// ==========================================
export async function login(req: Request, res: Response, next: NextFunction) {
  const { cedula } = req.body;
  const cleanCedula = cedula.trim().toUpperCase();

  try {
    let rol: 'admin' | 'candidato' = 'candidato';
    let existe = false;

    if (isUsingFallback()) {
      existe = Array.from(memoryDb.candidatos.values()).some(
        (cand) => cand.cedula.toUpperCase() === cleanCedula
      );
    } else {
      const pool = await getConnectionPool();

      // Buscar si existe como usuario con rol admin
      const userRes = await pool
        .request()
        .input('cedula', sql.VarChar(20), cleanCedula)
        .query(`
          SELECT u.rol FROM tbl_usuarios_candidatos u
          INNER JOIN tbl_candidatos c ON c.candidato_id = u.candidato_id
          WHERE c.cedula = @cedula
        `);
      
      if (userRes.recordset.length > 0) {
        existe = true;
        rol = userRes.recordset[0].rol || 'candidato';
      } else {
        // Buscar solo en candidatos
        const candRes = await pool
          .request()
          .input('cedula', sql.VarChar(20), cleanCedula)
          .query('SELECT candidato_id FROM tbl_candidatos WHERE cedula = @cedula');
        existe = (candRes.recordset.length > 0);
      }
    }

    const token = jwt.sign({ cedula: cleanCedula, rol, method: 'cedula' }, JWT_SECRET, {
      expiresIn: '2h',
    });

    res.status(200).json({
      status: 'success',
      token,
      candidato: {
        cedula: cleanCedula,
        rol,
        existe,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ==========================================
// LOGIN POR EMAIL + PASSWORD (candidatos registrados)
// ==========================================
export async function loginEmail(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;

  try {
    if (isUsingFallback()) {
      res.status(503).json({ status: 'fail', message: 'Base de datos no disponible' });
      return;
    }

    const pool = await getConnectionPool();

    // Buscar usuario por email
    const userResult = await pool
      .request()
      .input('email', sql.VarChar(150), email.toLowerCase().trim())
      .query(`
        SELECT u.id_usuario, u.email, u.password_hash, u.candidato_id,
               c.cedula
        FROM tbl_usuarios_candidatos u
        INNER JOIN tbl_candidatos c ON c.candidato_id = u.candidato_id
        WHERE u.email = @email AND u.activo = 1
      `);

    if (userResult.recordset.length === 0) {
      res.status(401).json({ status: 'fail', message: 'Email o contraseña incorrectos' });
      return;
    }

    const user = userResult.recordset[0];
    const passwordOk = await bcrypt.compare(password, user.password_hash);

    if (!passwordOk) {
      res.status(401).json({ status: 'fail', message: 'Email o contraseña incorrectos' });
      return;
    }

    const token = jwt.sign({
      cedula: user.cedula,
      candidato_id: user.candidato_id,
      email: user.email,
      method: 'email',
    }, JWT_SECRET, { expiresIn: '2h' });

    res.status(200).json({
      status: 'success',
      token,
      candidato: {
        cedula: user.cedula,
        candidato_id: user.candidato_id,
        email: user.email,
        existe: true,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ==========================================
// VALIDAR TOKEN DE INVITACIÓN
// ==========================================
export async function validarToken(req: Request, res: Response, next: NextFunction) {
  const { token } = req.params;

  try {
    if (isUsingFallback()) {
      res.status(503).json({ status: 'fail', message: 'Base de datos no disponible' });
      return;
    }

    const pool = await getConnectionPool();
    const result = await pool
      .request()
      .input('token', sql.VarChar(255), token)
      .query(`
        SELECT u.id_usuario, u.candidato_id, u.email, u.token_expiracion,
               c.cedula, c.pnombre, c.papellido, c.celular
        FROM tbl_usuarios_candidatos u
        INNER JOIN tbl_candidatos c ON c.candidato_id = u.candidato_id
        WHERE u.token_invitacion = @token AND u.activo = 1
      `);

    if (result.recordset.length === 0) {
      res.status(404).json({ status: 'fail', message: 'Token inválido o expirado' });
      return;
    }

    const data = result.recordset[0];

    // Verificar si el token ha expirado
    if (data.token_expiracion && new Date(data.token_expiracion) < new Date()) {
      res.status(410).json({ status: 'fail', message: 'El enlace de invitación ha expirado' });
      return;
    }

    // Si ya tiene email, significa que ya se registró
    if (data.email) {
      res.status(200).json({
        status: 'success',
        yaRegistrado: true,
        candidato: {
          id: data.candidato_id,
          cedula: data.cedula,
          nombre: `${data.pnombre} ${data.papellido}`,
          email: data.email,
        },
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      yaRegistrado: false,
      candidato: {
        id: data.candidato_id,
        cedula: data.cedula,
        nombre: `${data.pnombre || ''} ${data.papellido || ''}`.trim(),
        celular: data.celular,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ==========================================
// REGISTRO POR INVITACIÓN
// ==========================================
export async function registro(req: Request, res: Response, next: NextFunction) {
  const { token, email, password } = req.body;

  try {
    if (isUsingFallback()) {
      res.status(503).json({ status: 'fail', message: 'Base de datos no disponible' });
      return;
    }

    const pool = await getConnectionPool();

    // Validar token
    const tokenResult = await pool
      .request()
      .input('token', sql.VarChar(255), token)
      .query(`
        SELECT candidato_id FROM tbl_usuarios_candidatos
        WHERE token_invitacion = @token AND activo = 1
      `);

    if (tokenResult.recordset.length === 0) {
      res.status(404).json({ status: 'fail', message: 'Token inválido' });
      return;
    }

    const candidatoId = tokenResult.recordset[0].candidato_id;

    // Verificar que el email no esté ya registrado
    const emailCheck = await pool
      .request()
      .input('email', sql.VarChar(150), email.toLowerCase().trim())
      .query('SELECT id_usuario FROM tbl_usuarios_candidatos WHERE email = @email');

    if (emailCheck.recordset.length > 0) {
      res.status(409).json({ status: 'fail', message: 'Este email ya está registrado' });
      return;
    }

    // Hash de password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Actualizar usuario con email y password
    await pool
      .request()
      .input('candidato_id', sql.Int, candidatoId)
      .input('email', sql.VarChar(150), email.toLowerCase().trim())
      .input('password_hash', sql.VarChar(255), passwordHash)
      .query(`
        UPDATE tbl_usuarios_candidatos
        SET email = @email,
            password_hash = @password_hash,
            fecha_modificacion = GETDATE()
        WHERE candidato_id = @candidato_id
      `);

    res.status(200).json({
      status: 'success',
      message: 'Registro completado. Ahora puedes iniciar sesión.',
      candidato_id: candidatoId,
    });
  } catch (error) {
    next(error);
  }
}

// ==========================================
// LOGIN POR EMAIL + CÉDULA (candidatos)
// ==========================================
export async function loginEmailCedula(req: Request, res: Response, next: NextFunction) {
  const { email, cedula } = req.body;

  try {
    if (isUsingFallback()) {
      res.status(503).json({ status: 'fail', message: 'Base de datos no disponible' });
      return;
    }

    const pool = await getConnectionPool();
    const cleanCedula = cedula.trim().toUpperCase();
    const cleanEmail = email.toLowerCase().trim();

    const userResult = await pool
      .request()
      .input('email', sql.VarChar(150), cleanEmail)
      .input('cedula', sql.VarChar(20), cleanCedula)
      .query(`
        SELECT u.id_usuario, u.email, u.candidato_id, u.activo, u.rol,
               c.cedula, c.pnombre, c.papellido
        FROM tbl_usuarios_candidatos u
        INNER JOIN tbl_candidatos c ON c.candidato_id = u.candidato_id
        WHERE u.email = @email AND c.cedula = @cedula AND u.activo = 1
      `);

    if (userResult.recordset.length === 0) {
      res.status(401).json({ status: 'fail', message: 'Email o cédula incorrectos' });
      return;
    }

    const user = userResult.recordset[0];
    const rol = user.rol || 'candidato';

    const token = jwt.sign({
      cedula: user.cedula,
      candidato_id: user.candidato_id,
      email: user.email,
      rol,
      method: 'email_cedula',
    }, JWT_SECRET, { expiresIn: '2h' });

    res.status(200).json({
      status: 'success',
      token,
      candidato: {
        cedula: user.cedula,
        candidato_id: user.candidato_id,
        nombre: `${user.pnombre} ${user.papellido}`,
        email: user.email,
        rol,
        existe: true,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ==========================================
// GENERAR TOKEN DE INVITACIÓN (admin)
// ==========================================
export async function generarInvitacion(req: Request, res: Response, next: NextFunction) {
  const { cedula: rawCedula, nombres, apellidos, celular, dias_expiracion } = req.body;

  try {
    if (isUsingFallback()) {
      res.status(503).json({ status: 'fail', message: 'Base de datos no disponible' });
      return;
    }

    const pool = await getConnectionPool();
    const token = crypto.randomBytes(32).toString('hex');
    const expiracion = new Date();
    expiracion.setDate(expiracion.getDate() + (dias_expiracion || 2));

    // Si no se proporciona cédula, generar una automática
    let cedula = rawCedula?.trim().toUpperCase();
    if (!cedula) {
      cedula = `TMP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    }

    // Buscar si el candidato ya existe por cédula
    let candidatoId: number;
    const existing = await pool
      .request()
      .input('cedula', sql.VarChar(20), cedula.trim().toUpperCase())
      .query('SELECT candidato_id FROM tbl_candidatos WHERE cedula = @cedula');

    if (existing.recordset.length > 0) {
      candidatoId = existing.recordset[0].candidato_id;
    } else {
      // Crear candidato básico
      const insertResult = await pool
        .request()
        .input('cedula', sql.VarChar(20), cedula.trim().toUpperCase())
        .input('pnombre', sql.VarChar(50), nombres || '')
        .input('papellido', sql.VarChar(50), apellidos || '')
        .input('fecha_nac', sql.Date, '1990-01-01')
        .input('nacionalidad', sql.VarChar(50), 'Nicaragüense')
        .input('e_civil', sql.Char(1), 'S')
        .input('celular', sql.VarChar(20), celular || null)
        .query(`
          INSERT INTO tbl_candidatos (cedula, pnombre, papellido, fecha_nac, nacionalidad, e_civil, celular)
          OUTPUT INSERTED.candidato_id
          VALUES (@cedula, @pnombre, @papellido, @fecha_nac, @nacionalidad, @e_civil, @celular)
        `);
      candidatoId = insertResult.recordset[0].candidato_id;
    }

    // Verificar si ya tiene usuario
    const userExists = await pool
      .request()
      .input('candidato_id', sql.Int, candidatoId)
      .query('SELECT id_usuario FROM tbl_usuarios_candidatos WHERE candidato_id = @candidato_id');

    if (userExists.recordset.length > 0) {
      // Actualizar token
      await pool
        .request()
        .input('candidato_id', sql.Int, candidatoId)
        .input('token', sql.VarChar(255), token)
        .input('expiracion', sql.DateTime2, expiracion)
        .query(`
          UPDATE tbl_usuarios_candidatos
          SET token_invitacion = @token, token_expiracion = @expiracion, fecha_modificacion = GETDATE()
          WHERE candidato_id = @candidato_id
        `);
    } else {
      // Crear registro de usuario con token (email NULL hasta que se registre)
      await pool
        .request()
        .input('candidato_id', sql.Int, candidatoId)
        .input('token', sql.VarChar(255), token)
        .input('expiracion', sql.DateTime2, expiracion)
        .query(`
          INSERT INTO tbl_usuarios_candidatos (candidato_id, password_hash, token_invitacion, token_expiracion)
          VALUES (@candidato_id, '', @token, @expiracion)
        `);
    }

    const link = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/registro?token=${token}`;

    res.status(200).json({
      status: 'success',
      message: 'Invitación generada',
      link,
      token,
      expira: expiracion,
    });
  } catch (error) {
    next(error);
  }
}

// ==========================================
// SSO LOGIN DESDE PORTAL (verifica token del portal)
// ==========================================
export async function ssoPortalLogin(req: Request, res: Response, next: NextFunction) {
  const { ssoToken } = req.body;

  try {
    if (!ssoToken) {
      res.status(400).json({ status: 'fail', message: 'Token SSO requerido' });
      return;
    }

    // Verificar token con el secreto compartido del portal
    let decoded: any;
    try {
      decoded = jwt.verify(ssoToken, SSO_SECRET);
    } catch (e) {
      // Usar 400 para que el interceptor de axios no redirija a login
      res.status(400).json({ status: 'fail', message: 'Token SSO inválido o expirado' });
      return;
    }

    const cedula = decoded.carnet || decoded.username || String(decoded.sub);
    const email = decoded.correo || '';
    const nombre = decoded.name || '';
    const apps = decoded.apps || [];

    if (isUsingFallback()) {
      res.status(503).json({ status: 'fail', message: 'Base de datos no disponible' });
      return;
    }

    const pool = await getConnectionPool();

    // Buscar candidato por cédula
    let candidatoId: number | null = null;
    const existingCand = await pool
      .request()
      .input('cedula', sql.VarChar(20), cedula)
      .query('SELECT candidato_id FROM tbl_candidatos WHERE cedula = @cedula');

    if (existingCand.recordset.length > 0) {
      candidatoId = existingCand.recordset[0].candidato_id;
    } else {
      // Crear candidato automáticamente
      const nombreParts = nombre.split(' ');
      const pnombre = nombreParts[0] || cedula;
      const papellido = nombreParts.slice(1).join(' ') || cedula;

      const newCand = await pool
        .request()
        .input('cedula', sql.VarChar(20), cedula)
        .input('pnombre', sql.VarChar(50), pnombre)
        .input('papellido', sql.VarChar(50), papellido)
        .input('fecha_nac', sql.Date, '1990-01-01')
        .input('nacionalidad', sql.VarChar(50), 'Nicaragüense')
        .input('e_civil', sql.Char(1), 'S')
        .query(`
          INSERT INTO tbl_candidatos (cedula, pnombre, papellido, fecha_nac, nacionalidad, e_civil)
          OUTPUT INSERTED.candidato_id
          VALUES (@cedula, @pnombre, @papellido, @fecha_nac, @nacionalidad, @e_civil)
        `);
      candidatoId = newCand.recordset[0].candidato_id;
    }

    // Asegurar que exista en tbl_usuarios_candidatos
    let userRol = 'candidato';
    const existingUser = await pool
      .request()
      .input('candidato_id', sql.Int, candidatoId)
      .query('SELECT id_usuario, rol FROM tbl_usuarios_candidatos WHERE candidato_id = @candidato_id');

    if (existingUser.recordset.length === 0) {
      await pool
        .request()
        .input('candidato_id', sql.Int, candidatoId)
        .input('email', sql.VarChar(150), email)
        .query(`
          INSERT INTO tbl_usuarios_candidatos (candidato_id, email, password_hash)
          VALUES (@candidato_id, @email, '')
        `);
    } else {
      userRol = existingUser.recordset[0].rol || 'candidato';
      if (email && existingUser.recordset[0].id_usuario) {
        await pool
          .request()
          .input('candidato_id', sql.Int, candidatoId)
          .input('email', sql.VarChar(150), email)
          .query(`
            UPDATE tbl_usuarios_candidatos SET email = @email, fecha_modificacion = GETDATE()
            WHERE candidato_id = @candidato_id AND (email IS NULL OR email = '')
          `);
      }
    }

    // Generar token de solicitud
    const token = jwt.sign({
      cedula,
      candidato_id: candidatoId,
      email,
      rol: userRol,
      method: 'sso_portal',
    }, JWT_SECRET, { expiresIn: '2h' });

    res.status(200).json({
      status: 'success',
      token,
      candidato: {
        cedula,
        candidato_id: candidatoId,
        nombre,
        email,
        rol: userRol,
        existe: true,
        apps,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ==========================================
// ASIGNAR ROL ADMIN (solo desde la BD o endpoint interno)
// ==========================================
export async function asignarAdmin(req: Request, res: Response, next: NextFunction) {
  const { cedula } = req.body;
  const cleanCedula = cedula.trim().toUpperCase();

  try {
    if (isUsingFallback()) {
      res.status(503).json({ status: 'fail', message: 'Base de datos no disponible' });
      return;
    }

    const pool = await getConnectionPool();

    // Buscar candidato
    const candRes = await pool
      .request()
      .input('cedula', sql.VarChar(20), cleanCedula)
      .query('SELECT candidato_id FROM tbl_candidatos WHERE cedula = @cedula');

    if (candRes.recordset.length === 0) {
      res.status(404).json({ status: 'fail', message: 'Candidato no encontrado' });
      return;
    }

    const candidatoId = candRes.recordset[0].candidato_id;

    // Verificar si existe en usuarios
    const userRes = await pool
      .request()
      .input('candidato_id', sql.Int, candidatoId)
      .query('SELECT id_usuario FROM tbl_usuarios_candidatos WHERE candidato_id = @candidato_id');

    if (userRes.recordset.length === 0) {
      // Crear usuario con rol admin
      await pool
        .request()
        .input('candidato_id', sql.Int, candidatoId)
        .query(`
          INSERT INTO tbl_usuarios_candidatos (candidato_id, email, password_hash, rol)
          VALUES (@candidato_id, '', '', 'admin')
        `);
    } else {
      // Actualizar rol
      await pool
        .request()
        .input('candidato_id', sql.Int, candidatoId)
        .query(`UPDATE tbl_usuarios_candidatos SET rol = 'admin' WHERE candidato_id = @candidato_id`);
    }

    res.status(200).json({ status: 'success', message: `Admin asignado a cédula ${cleanCedula}` });
  } catch (error) {
    next(error);
  }
}

// ==========================================
// LISTAR USUARIOS (admin)
// ==========================================
export async function listarUsuarios(req: Request, res: Response, next: NextFunction) {
  try {
    if (isUsingFallback()) {
      res.status(503).json({ status: 'fail', message: 'Base de datos no disponible' });
      return;
    }

    const pool = await getConnectionPool();
    const result = await pool
      .request()
      .query(`
        SELECT u.id_usuario, u.email, u.rol, u.activo, 
               c.cedula, c.pnombre, c.papellido, c.celular,
               c.fecha_sol
        FROM tbl_usuarios_candidatos u
        INNER JOIN tbl_candidatos c ON c.candidato_id = u.candidato_id
        ORDER BY u.rol, c.fecha_sol DESC
      `);

    res.status(200).json({
      status: 'success',
      data: result.recordset || [],
    });
  } catch (error) {
    next(error);
  }
}
