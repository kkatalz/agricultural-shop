import express from 'express';
import * as CategoryController from '../controllers/category.controller';
import { validate } from '../middleware/validate';
import { requireAuth, requireRole } from '../middleware/auth';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../schemas/category.schema';

const router = express.Router();

router.get('/', CategoryController.getCategories);
router.get('/:id', CategoryController.getCategoryById);

router.post(
  '/',
  requireAuth,
  requireRole('ADMIN'),
  validate(createCategorySchema),
  CategoryController.createCategory,
);

router.patch(
  '/:id',
  requireAuth,
  requireRole('ADMIN'),
  validate(updateCategorySchema),
  CategoryController.updateCategory,
);

router.delete(
  '/:id',
  requireAuth,
  requireRole('ADMIN'),
  CategoryController.deleteCategory,
);

export default router;
