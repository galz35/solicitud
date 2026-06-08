import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import apiRoutes from './routes/api.routes';
import { errorHandler } from './middleware/errorHandler';
import { getConnectionPool } from './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 1. Middlewares Globales
app.use(helmet()); // Seguridad de cabeceras HTTP
app.use(cors({
  origin: '*', // En producción limitar al dominio del frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(morgan('dev')); // Logger de peticiones HTTP
app.use(express.json()); // Parsing del body en formato JSON

// 2. Ruta de Salud / Ping
app.get('/ping', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// 3. Montar Rutas de la API
app.use('/api', apiRoutes);

// 4. Manejo de rutas 404
app.use((req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `No se pudo encontrar la ruta ${req.originalUrl} en este servidor.`,
  });
});

// 5. Middleware Global de Errores
app.use(errorHandler);

// 6. Arrancar Servidor e inicializar Base de Datos
app.listen(PORT, async () => {
  console.log(`=======================================================`);
  console.log(` Servidor API Express corriendo en puerto: ${PORT}`);
  console.log(` Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=======================================================`);
  
  try {
    // Intentar inicializar pool de base de datos SQL Server al arrancar
    await getConnectionPool();
  } catch (err) {
    // Se captura aquí pero el pool configurará el fallback internamente
    console.log('Servidor levantado exitosamente en modo Fallback local.');
  }
});

export default app;
