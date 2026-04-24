import { z } from 'zod';

export const oemCodeItemSchema = z.object({
  code: z
    .string()
    .min(1, 'OEM code is required')
    .max(64, 'OEM code must be less than 64 characters'),
  brand: z
    .string()
    .max(64, 'Brand must be less than 64 characters')
    .optional(),
});

export const createPartSchema = z.object({
  sku: z
    .string()
    .min(1, 'SKU is required')
    .max(64, 'SKU must be less than 64 characters'),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(200, 'Name must be less than 200 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(2000, 'Description must be less than 2000 characters'),
  priceRetail: z
    .number()
    .int('Price must be an integer')
    .positive('Price must be positive'),
  stock: z
    .number()
    .int('Stock must be an integer')
    .min(0, 'Stock must be non-negative')
    .default(0),
  categoryId: z
    .number()
    .int('Category id must be an integer')
    .positive('Category id must be positive'),
  oemCodes: z.array(oemCodeItemSchema).optional(),
});

export const updatePartSchema = createPartSchema.partial();

export const listPartsQuerySchema = z.object({
  category: z.coerce.number().int().positive().optional(),
  machineId: z.coerce.number().int().positive().optional(),
  search: z.string().trim().min(1).optional(),
  priceMin: z.coerce.number().int().min(0).optional(),
  priceMax: z.coerce.number().int().min(0).optional(),
});

export type CreatePartDto = z.infer<typeof createPartSchema>;
export type UpdatePartDto = z.infer<typeof updatePartSchema>;
export type ListPartsQueryDto = z.infer<typeof listPartsQuerySchema>;
