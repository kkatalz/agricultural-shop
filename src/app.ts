import express from 'express';
import routes from './routes';
import { notFound, errorHandler } from './middleware/error';
import { UPLOADS_DIR } from './middleware/upload';

const app = express();

app.use(express.json());

app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
