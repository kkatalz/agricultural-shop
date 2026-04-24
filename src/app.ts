import express from 'express';
import routes from './routes';
import { notFound, errorHandler } from './middleware/error';

const app = express();

app.use(express.json());

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
