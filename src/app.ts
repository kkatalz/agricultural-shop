import express from 'express';
import authRouter from './routes/auth';

export const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'agricultural-shop-api' });
});

app.use('/auth', authRouter);

