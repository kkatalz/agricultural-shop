import express from 'express';
import authRoutes from './auth.routes';
import partsRoutes from './parts.routes';
import categoriesRoutes from './categories.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/parts', partsRoutes);
router.use('/categories', categoriesRoutes);

export default router;
