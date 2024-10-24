import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '20mb' }));

app.use(express.urlencoded({ limit: '20mb' }));

app.use(express.static('public'));

app.use(cookieParser());

import router from './routes/user.routes.js';

app.use('/api/v1/users/', router);

export { app };
