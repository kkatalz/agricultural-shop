import express from 'express';
import * as PartController from '../controllers/part.controller';
import { validate } from '../middleware/validate';
import { requireAuth, requireRole } from '../middleware/auth';
import { createPartSchema, updatePartSchema } from '../schemas/part.schema';

const router = express.Router();

router.get('/', PartController.getParts);
router.get('/search/oem/:code', PartController.getPartsByOemCode);
router.get('/:id', PartController.getPartById);

router.post(
  '/',
  requireAuth,
  requireRole('ADMIN'),
  validate(createPartSchema),
  PartController.createPart,
);

router.patch(
  '/:id',
  requireAuth,
  requireRole('ADMIN'),
  validate(updatePartSchema),
  PartController.updatePart,
);

router.delete(
  '/:id',
  requireAuth,
  requireRole('ADMIN'),
  PartController.deletePart,
);

export default router;
