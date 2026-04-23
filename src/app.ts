import express from 'express';
import authRouter from './routes/auth';
import { errorHandler } from './middleware/error';

export const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'agricultural-shop-api' });
});

app.use('/auth', authRouter);

app.use(errorHandler);
