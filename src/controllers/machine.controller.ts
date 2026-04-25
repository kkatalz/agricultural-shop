import type { Request, Response, NextFunction } from 'express';
import * as MachineService from '../services/machine.service';
import {
  listMachinesQuerySchema,
  CreateMachineDto,
} from '../schemas/machine.schema';

export async function getMachines(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = listMachinesQuerySchema.parse(req.query);
    const data = await MachineService.list(query);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function createMachine(
  req: Request<{}, {}, CreateMachineDto>,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await MachineService.create(req.body);
    res.status(201).json({ data });
  } catch (err) {
    next(err);
  }
}

export async function getMachineParts(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await MachineService.listParts(Number(req.params.id));
    res.json({ data });
  } catch (err) {
    next(err);
  }
}
