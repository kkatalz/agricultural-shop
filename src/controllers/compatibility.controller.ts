import type { Request, Response, NextFunction } from 'express';
import * as CompatibilityService from '../services/compatibility.service';
import { parseId } from '../middleware/validate';
import {
  listCompatibilitiesQuerySchema,
  CreateCompatibilityDto,
  UpdateCompatibilityDto,
} from '../schemas/compatibility.schema';

export async function getCompatibilities(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = listCompatibilitiesQuerySchema.parse(req.query);
    const data = await CompatibilityService.list(query);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function createCompatibility(
  req: Request<{}, {}, CreateCompatibilityDto>,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await CompatibilityService.create(req.body);
    res.status(201).json({ data });
  } catch (err) {
    next(err);
  }
}

export async function updateCompatibility(
  req: Request<{ partId: string; machineId: string }, {}, UpdateCompatibilityDto>,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await CompatibilityService.update(
      parseId(req.params.partId, 'partId'),
      parseId(req.params.machineId, 'machineId'),
      req.body,
    );
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function deleteCompatibility(
  req: Request<{ partId: string; machineId: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await CompatibilityService.remove(
      parseId(req.params.partId, 'partId'),
      parseId(req.params.machineId, 'machineId'),
    );
    res.json({ data });
  } catch (err) {
    next(err);
  }
}
