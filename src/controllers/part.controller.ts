import type { Request, Response, NextFunction } from 'express';
import * as PartService from '../services/part.service';
import { HttpError } from '../middleware/error';
import {
  listPartsQuerySchema,
  CreatePartDto,
  UpdatePartDto,
} from '../schemas/part.schema';

export async function getParts(req: Request, res: Response, next: NextFunction) {
  try {
    const query = listPartsQuerySchema.parse(req.query);
    const data = await PartService.list(query);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function getPartById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await PartService.getById(Number(req.params.id));
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function getPartsByOemCode(
  req: Request<{ code: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await PartService.findByOemCode(req.params.code);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function createPart(
  req: Request<{}, {}, CreatePartDto>,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await PartService.create(req.body);
    res.status(201).json({ data });
  } catch (err) {
    next(err);
  }
}

export async function updatePart(
  req: Request<{ id: string }, {}, UpdatePartDto>,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await PartService.update(Number(req.params.id), req.body);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function deletePart(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await PartService.remove(Number(req.params.id));
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function uploadPhoto(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.file)
      throw new HttpError(400, 'No photo file provided (field name is: photo)');

    const isPrimary =
      req.body.isPrimary === 'true' || req.body.isPrimary === true;

    const data = await PartService.addPhoto(
      Number(req.params.id),
      req.file,
      isPrimary,
    );
    res.status(201).json({ data });
  } catch (err) {
    next(err);
  }
}

export async function deletePhoto(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await PartService.removePhoto(Number(req.params.id));
    res.json({ data });
  } catch (err) {
    next(err);
  }
}
