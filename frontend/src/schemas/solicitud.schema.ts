import { z } from 'zod';

const cedulaRegex = /^\d{13}[A-Z]$/;

// Paso 1: Datos Generales
export const datosGeneralesSchema = z.object({
  cedula: z.string().regex(cedulaRegex, {
    message: 'Formato incorrecto. Ej: 0012508900012A (13 números y 1 letra mayúscula)',
  }),
  pnombre: z.string().min(1, 'El primer nombre es obligatorio'),
  snombre: z.string().optional().nullable(),
  papellido: z.string().min(1, 'El primer apellido es obligatorio'),
  sapellido: z.string().optional().nullable(),
  fecha_nac: z.string().min(1, 'La fecha de nacimiento es obligatoria'),
  lugar_nac: z.string().min(1, 'El lugar de nacimiento es obligatorio'),
  nacionalidad: z.string().min(1, 'La nacionalidad es obligatoria'),
  inss: z.string().optional().nullable(),
  ruc: z.string().optional().nullable(),
  estatura: z.coerce.number().positive('Debe ser número positivo').max(3, 'Estatura inválida').optional().nullable(),
  peso: z.coerce.number().positive('Debe ser número positivo').max(500, 'Peso inválido').optional().nullable(),
  licencia: z.enum(['S', 'N']).default('N'),
  cat_licencia: z.string().optional().nullable(),
  vehiculo: z.enum(['S', 'N']).default('N'),
  marca: z.string().optional().nullable(),
  ano_vehic: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 1).optional().nullable(),
  celular: z.string().min(8, 'El celular es obligatorio (mínimo 8 dígitos)'),
  telefono_dom: z.string().optional().nullable(),
  departamento_dom: z.string().min(1, 'El departamento es obligatorio'),
  ciudad_dom: z.string().min(1, 'La ciudad es obligatoria'),
  direccion_dom: z.string().min(10, 'La dirección debe ser más descriptiva'),
  tipo_casa: z.string().min(1, 'El tipo de casa es obligatorio'),
  cuenta_banco: z.enum(['S', 'N']).default('N'),
  banco: z.string().optional().nullable(),
  no_cuenta: z.string().optional().nullable(),
  pasaporte: z.string().optional().nullable(),
  e_civil: z.enum(['S', 'C', 'V', 'D', 'A']),
  
  // Salud
  penfermedad: z.enum(['S', 'N']).default('N'),
  enfermedad: z.string().optional().nullable(),
  palergia: z.enum(['S', 'N']).default('N'),
  alergia: z.string().optional().nullable(),
  tsangre: z.string().min(1, 'El tipo de sangre es obligatorio'),
  p_deporte: z.string().optional().nullable(),
  t_tarjeta: z.enum(['S', 'N']).default('N'),
  
  // Contacto Emergencia
  contacto_emer: z.string().min(1, 'El contacto de emergencia es obligatorio'),
  parentesco_cont: z.string().min(1, 'El parentesco es obligatorio'),
  tel_contacto: z.string().min(8, 'El teléfono de emergencia es obligatorio'),
});

// Paso 2: Familiar
export const familiarSchema = z.object({
  nombre: z.string().min(1, 'El nombre completo es obligatorio'),
  parentesco: z.string().min(1, 'El parentesco es obligatorio'),
  l_trabajo: z.string().optional().nullable(),
  direccion: z.string().optional().nullable(),
});

// Paso 3: Académico
export const academicoSchema = z.object({
  nivel_academico: z.enum(['P', 'S', 'T', 'U', 'Pg', 'M', 'D']),
  titulo: z.string().min(1, 'El título obtenido es obligatorio'),
  estado: z.enum(['Graduado', 'Cursando', 'Incompleto']),
  ult_ano_aprob: z.coerce.number().int().positive().optional().nullable(),
  institucion: z.string().min(1, 'La institución es obligatoria'),
  duracion: z.string().optional().nullable(),
});

// Paso 5: Experiencia
export const experienciaSchema = z.object({
  empresa: z.string().min(1, 'El nombre de la empresa es obligatorio'),
  giro: z.string().optional().nullable(),
  cargo: z.string().min(1, 'El cargo desempeñado es obligatorio'),
  jefe_inmediato: z.string().optional().nullable(),
  f_ingreso: z.string().min(1, 'La fecha de ingreso es obligatoria'),
  f_salida: z.string().optional().nullable(),
  motivo_salida: z.string().optional().nullable(),
});

// Paso 6: Puesto
export const puestoSchema = z.object({
  puesto: z.string().min(1, 'El puesto solicitado es obligatorio'),
  salario_max: z.coerce.number().positive('Debe ser número positivo').optional().nullable(),
  salario_min: z.coerce.number().positive('Debe ser número positivo').optional().nullable(),
  turno: z.string().min(1, 'El turno solicitado es obligatorio'),
  obs_horario: z.string().optional().nullable(),
  experiencia: z.string().optional().nullable(),
});

// Paso 7: Referencia
export const referenciaSchema = z.object({
  nombre_completo: z.string().min(1, 'El nombre completo es obligatorio'),
  direccion: z.string().optional().nullable(),
  empresa: z.string().optional().nullable(),
  edad: z.coerce.number().int().positive().optional().nullable(),
  telefono: z.string().min(8, 'El teléfono es obligatorio'),
  tipo_relacion: z.enum(['Personal', 'Laboral']),
  interno: z.enum(['S', 'N']).default('N'),
});

// Paso 4: Idioma
export const candidatoIdiomaSchema = z.object({
  cod_idioma: z.coerce.number().int().positive(),
  n_lectura: z.coerce.number().int().min(0).max(100),
  n_escritura: z.coerce.number().int().min(0).max(100),
  n_conversacion: z.coerce.number().int().min(0).max(100),
});
