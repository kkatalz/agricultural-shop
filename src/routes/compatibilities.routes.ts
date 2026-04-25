import express from 'express';
import * as CompatibilityController from '../controllers/compatibility.controller';
import { validate } from '../middleware/validate';
import { requireAuth, requireRole } from '../middleware/auth';
import {
  createCompatibilitySchema,
  updateCompatibilitySchema,
} from '../schemas/compatibility.schema';

const router = express.Router();

router.get('/', CompatibilityController.getCompatibilities);

router.post(
  '/',
  requireAuth,
  requireRole('ADMIN'),
  validate(createCompatibilitySchema),
  CompatibilityController.createCompatibility,
);

router.patch(
  '/:partId/:machineId',
  requireAuth,
  requireRole('ADMIN'),
  validate(updateCompatibilitySchema),
  CompatibilityController.updateCompatibility,
);

router.delete(
  '/:partId/:machineId',
  requireAuth,
  requireRole('ADMIN'),
  CompatibilityController.deleteCompatibility,
);

export default router;
