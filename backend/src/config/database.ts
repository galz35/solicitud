import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig: sql.config = {
  user: process.env.DB_USER || 'Reclutamiento',
  password: process.env.DB_PASSWORD || 'sel3Rh2011',
  server: process.env.DB_SERVER || '192.168.8.234',
  database: process.env.DB_NAME || 'Sol_Empleo',
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true', // true para Azure, false para local
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true', // true para desarrollo local
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool: sql.ConnectionPool | null = null;
let useFallbackDb = false;

// Base de datos en memoria simulada (fallback por si no hay conexión al SQL Server corporativo 192.168.8.234)
export const memoryDb = {
  candidatos: new Map<number, any>(),
  saludDeportes: new Map<number, any>(),
  puestos: new Map<number, any>(),
  emergencia: new Map<number, any>(),
  familiares: [] as any[],
  academicos: [] as any[],
  experiencia: [] as any[],
  referencias: [] as any[],
  candidatoIdiomas: [] as any[],
  idiomas: [
    { cod_idioma: 1, descripcion: 'Español' },
    { cod_idioma: 2, descripcion: 'Inglés' },
    { cod_idioma: 3, descripcion: 'Francés' },
    { cod_idioma: 4, descripcion: 'Alemán' },
    { cod_idioma: 5, descripcion: 'Mandarín' },
  ],
  nextCandidatoId: 1,
  nextFamiliarId: 1,
  nextAcademicoId: 1,
  nextExperienciaId: 1,
  nextReferenciaId: 1,
};

export async function getConnectionPool(): Promise<sql.ConnectionPool> {
  if (useFallbackDb) {
    throw new Error('Database connection is disabled, using memory fallback');
  }

  if (pool) {
    return pool;
  }

  try {
    console.log(`Intentando conectar a SQL Server en ${dbConfig.server}...`);
    pool = await new sql.ConnectionPool(dbConfig).connect();
    console.log('Conexión a base de datos SQL Server establecida correctamente.');
    return pool;
  } catch (error) {
    console.error('Error al conectar con SQL Server:', (error as Error).message);
    console.warn('⚠️ ATENCIÓN: No se pudo conectar al servidor SQL Server corporativo.');
    console.warn('El backend iniciará en modo FALLBACK utilizando base de datos en memoria para propósitos de prueba local.');
    useFallbackDb = true;
    throw error;
  }
}

export function isUsingFallback(): boolean {
  return useFallbackDb;
}

export { sql };
