import { z } from 'zod';

const cedulaRegex = /^\d{13}[A-Z]$/;

export const registrarCandidatoSchema = z.object({
  body: z.object({
    cedula: z.string().regex(cedulaRegex, {
      message: 'La cédula debe constar de 13 números seguidos de una letra mayúscula.',
    }),
    pnombre: z.string().min(1, 'El primer nombre es obligatorio.'),
    snombre: z.string().optional().nullable(),
    papellido: z.string().min(1, 'El primer apellido es obligatorio.'),
    sapellido: z.string().optional().nullable(),
    fecha_nac: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'La fecha de nacimiento debe ser una fecha válida.',
    }),
    lugar_nac: z.string().optional().nullable(),
    nacionalidad: z.string().min(1, 'La nacionalidad es obligatoria.'),
    inss: z.string().optional().nullable(),
    ruc: z.string().optional().nullable(),
    estatura: z.number().positive().max(3).optional().nullable(),
    peso: z.number().positive().max(500).optional().nullable(),
    licencia: z.enum(['S', 'N']).default('N'),
    cat_licencia: z.string().optional().nullable(),
    vehiculo: z.enum(['S', 'N']).default('N'),
    marca: z.string().optional().nullable(),
    ano_vehic: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional().nullable(),
    celular: z.string().optional().nullable(),
    telefono_dom: z.string().optional().nullable(),
    departamento_dom: z.string().optional().nullable(),
    ciudad_dom: z.string().optional().nullable(),
    direccion_dom: z.string().optional().nullable(),
    tipo_casa: z.string().optional().nullable(),
    cuenta_banco: z.enum(['S', 'N']).default('N'),
    banco: z.string().optional().nullable(),
    no_cuenta: z.string().optional().nullable(),
    pasaporte: z.string().optional().nullable(),
    e_civil: z.enum(['S', 'C', 'V', 'D', 'A']),
    
    // Salud y deportes
    penfermedad: z.enum(['S', 'N']).default('N'),
    enfermedad: z.string().optional().nullable(),
    palergia: z.enum(['S', 'N']).default('N'),
    alergia: z.string().optional().nullable(),
    tsangre: z.string().optional().nullable(),
    p_deporte: z.string().optional().nullable(),
    t_tarjeta: z.enum(['S', 'N']).default('N'),
    
    // Puesto solicitado
    puesto: z.string().min(1, 'El puesto solicitado es obligatorio.'),
    salario_max: z.number().positive().optional().nullable(),
    salario_min: z.number().positive().optional().nullable(),
    turno: z.string().optional().nullable(),
    obs_horario: z.string().optional().nullable(),
    experiencia: z.string().optional().nullable(),
    
    // Contacto de emergencia
    contacto_emer: z.string().min(1, 'El nombre del contacto de emergencia es obligatorio.'),
    parentesco_cont: z.string().min(1, 'El parentesco del contacto de emergencia es obligatorio.'),
    tel_contacto: z.string().min(1, 'El teléfono del contacto de emergencia es obligatorio.'),
  }),
});
