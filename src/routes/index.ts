import express from 'express';
import authRoutes from './auth.routes';
import partsRoutes from './parts.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/parts', partsRoutes);

export default router;
