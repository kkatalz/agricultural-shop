import express from 'express';
import * as MachineController from '../controllers/machine.controller';
import { validate } from '../middleware/validate';
import { requireAuth, requireRole } from '../middleware/auth';
import { createMachineSchema } from '../schemas/machine.schema';

const router = express.Router();

router.get('/', MachineController.getMachines);
router.get('/:id/parts', MachineController.getMachineParts);

router.post(
  '/',
  requireAuth,
  requireRole('ADMIN'),
  validate(createMachineSchema),
  MachineController.createMachine,
);

export default router;
