// src/server.js
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';             // 👈 aquí
import swaggerUi from 'swagger-ui-express';
import { swaggerDoc } from './swagger.js';
import analyticsRouter from './Routes/analytics.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

// CORS: permite todas las origins (ajusta si necesitas restringir)
app.use(cors({
  origin: '*',               // o ['http://localhost:5173', 'https://tu-dominio.com']
  methods: ['GET','POST'],   // puedes añadir PUT, DELETE, etc.
  allowedHeaders: ['Content-Type','Authorization']
}));

// Rutas
app.get('/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc, { explorer: true }));
app.get('/openapi.json', (_req, res) => res.json(swaggerDoc));
app.use('/api', analyticsRouter);

// Start
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API ready on http://127.0.0.1:${port}`);
  console.log(`Docs → http://127.0.0.1:${port}/docs`);
});
