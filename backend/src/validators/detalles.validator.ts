import { z } from 'zod';

// 1. VALIDACIÓN DE LOGIN
export const loginSchema = z.object({
  body: z.object({
    cedula: z.string().regex(/^\d{13}[A-Z]$/, {
      message: 'La cédula debe constar de 13 números seguidos de una letra mayúscula.',
    }),
  }),
});

// 2. VALIDACIÓN DE DATOS FAMILIARES
export const familiarSchema = z.object({
  body: z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio.'),
    parentesco: z.string().min(1, 'El parentesco es obligatorio.'),
    l_trabajo: z.string().optional().nullable(),
    direccion: z.string().optional().nullable(),
  }),
});

// 3. VALIDACIÓN DE DATOS ACADÉMICOS
export const academicoSchema = z.object({
  body: z.object({
    nivel_academico: z.enum(['P', 'S', 'T', 'U', 'Pg', 'M', 'D']),
    titulo: z.string().min(1, 'El título obtenido es obligatorio.'),
    estado: z.enum(['Graduado', 'Cursando', 'Incompleto']),
    ult_ano_aprob: z.number().int().positive().optional().nullable(),
    institucion: z.string().min(1, 'La institución es obligatoria.'),
    duracion: z.string().optional().nullable(),
  }),
});

// 4. VALIDACIÓN DE EXPERIENCIA PROFESIONAL
export const experienciaSchema = z.object({
  body: z.object({
    empresa: z.string().min(1, 'El nombre de la empresa es obligatorio.'),
    giro: z.string().optional().nullable(),
    cargo: z.string().min(1, 'El cargo desempeñado es obligatorio.'),
    jefe_inmediato: z.string().optional().nullable(),
    f_ingreso: z.string().optional().nullable().refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'La fecha de ingreso debe ser una fecha válida.',
    }),
    f_salida: z.string().optional().nullable().refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'La fecha de salida debe ser una fecha válida.',
    }),
    motivo_salida: z.string().optional().nullable(),
  }),
});

// 5. VALIDACIÓN DE REFERENCIAS
export const referenciaSchema = z.object({
  body: z.object({
    nombre_completo: z.string().min(1, 'El nombre de la referencia es obligatorio.'),
    direccion: z.string().optional().nullable(),
    empresa: z.string().optional().nullable(),
    edad: z.number().int().positive().optional().nullable(),
    telefono: z.string().optional().nullable(),
    tipo_relacion: z.enum(['Personal', 'Laboral']),
    interno: z.enum(['S', 'N']).default('N'),
  }),
});

// 6. VALIDACIÓN DE IDIOMA DEL CANDIDATO
export const candidatoIdiomaSchema = z.object({
  body: z.object({
    cod_idioma: z.number().int().positive('Código de idioma inválido.'),
    n_lectura: z.number().int().min(0).max(100),
    n_escritura: z.number().int().min(0).max(100),
    n_conversacion: z.number().int().min(0).max(100),
  }),
});
