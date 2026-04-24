import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100, 'Slug must be less than 100 characters')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be lowercase letters, numbers, and hyphens',
    ),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
