import express from 'express';
import authRoutes from './auth.routes';
import partsRoutes from './parts.routes';
import categoriesRoutes from './categories.routes';
import machinesRoutes from './machines.routes';
import compatibilitiesRoutes from './compatibilities.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/parts', partsRoutes);
router.use('/categories', categoriesRoutes);
router.use('/machines', machinesRoutes);
router.use('/compatibilities', compatibilitiesRoutes);

export default router;
