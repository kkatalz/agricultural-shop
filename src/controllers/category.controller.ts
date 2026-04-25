import type { Request, Response, NextFunction } from 'express';
import * as CategoryService from '../services/category.service';
import { parseId } from '../middleware/validate';
import type {
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../schemas/category.schema';

export async function getCategories(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await CategoryService.list();
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function getCategoryById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await CategoryService.getById(parseId(req.params.id));
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function createCategory(
  req: Request<{}, {}, CreateCategoryDto>,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await CategoryService.create(req.body);
    res.status(201).json({ data });
  } catch (err) {
    next(err);
  }
}

export async function updateCategory(
  req: Request<{ id: string }, {}, UpdateCategoryDto>,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await CategoryService.update(parseId(req.params.id), req.body);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function deleteCategory(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await CategoryService.remove(parseId(req.params.id));
    res.json({ data });
  } catch (err) {
    next(err);
  }
}
