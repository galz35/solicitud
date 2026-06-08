import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import * as catalogoController from '../controllers/catalogo.controller';
import * as candidatoController from '../controllers/candidato.controller';
import * as busquedaController from '../controllers/busqueda.controller';

import { protect, restrictTo } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

import { registrarCandidatoSchema } from '../validators/candidato.validator';
import {
  loginSchema,
  loginEmailSchema,
  registroSchema,
  invitacionSchema,
  familiarSchema,
  academicoSchema,
  experienciaSchema,
  referenciaSchema,
  candidatoIdiomaSchema,
} from '../validators/detalles.validator';

const router = Router();

// ==========================================
// RUTAS PÚBLICAS / AUTENTICACIÓN
// ==========================================
router.post('/auth/login', validate(loginSchema), authController.login);
router.post('/auth/login-email', validate(loginEmailSchema), authController.loginEmail);
router.post('/auth/registro', validate(registroSchema), authController.registro);
router.post('/auth/login-email-cedula', authController.loginEmailCedula);
router.get('/auth/validar-token/:token', authController.validarToken);


// ==========================================
// RUTAS PROTEGIDAS (MÉTODO COMÚN POR JWT)
// ==========================================
router.use(protect);

// Perfil del candidato autenticado (por JWT, no por params)
router.get('/candidatos/me', candidatoController.getMe);

// 1. Catálogos
router.get('/catalogos/idiomas', catalogoController.getIdiomas);
router.get('/catalogos/nacionalidades', catalogoController.getNacionalidades);
router.get('/catalogos/niveles-academicos', catalogoController.getNivelesAcademicos);
router.get('/catalogos/estados-civiles', catalogoController.getEstadosCiviles);
router.get('/catalogos/tipos-sangre', catalogoController.getTiposSangre);

// 2. Operaciones sobre Candidatos
// Obtener solicitud completa del candidato logueado o administrador
router.get('/candidatos/:cedula', candidatoController.getCandidato);

// Guardar datos base 1:1
router.post('/candidatos', validate(registrarCandidatoSchema), candidatoController.guardarCandidato);

// CRUD Datos Familiares
router.post('/candidatos/:cedula/familiares', validate(familiarSchema), candidatoController.guardarFamiliar);
router.delete('/candidatos/:cedula/familiares/:id', candidatoController.eliminarFamiliar);

// CRUD Datos Académicos
router.post('/candidatos/:cedula/academicos', validate(academicoSchema), candidatoController.guardarAcademico);
router.delete('/candidatos/:cedula/academicos/:id', candidatoController.eliminarAcademico);

// CRUD Experiencia Profesional
router.post('/candidatos/:cedula/experiencia', validate(experienciaSchema), candidatoController.guardarExperiencia);
router.delete('/candidatos/:cedula/experiencia/:id', candidatoController.eliminarExperiencia);

// CRUD Referencias
router.post('/candidatos/:cedula/referencias', validate(referenciaSchema), candidatoController.guardarReferencia);
router.delete('/candidatos/:cedula/referencias/:id', candidatoController.eliminarReferencia);

// CRUD Idiomas
router.post('/candidatos/:cedula/idiomas', validate(candidatoIdiomaSchema), candidatoController.guardarIdioma);
router.delete('/candidatos/:cedula/idiomas/:cod_idioma', candidatoController.eliminarIdioma);


// ==========================================
// RUTAS EXCLUSIVAS DE ADMINISTRADOR
// ==========================================
router.post('/admin/invitacion', restrictTo('admin'), validate(invitacionSchema), authController.generarInvitacion);
router.get('/buscar', restrictTo('admin'), busquedaController.buscarCandidatos);

export default router;
