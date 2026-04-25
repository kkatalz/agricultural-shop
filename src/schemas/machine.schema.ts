import { z } from 'zod';

export const createMachineSchema = z
  .object({
    brand: z
      .string()
      .min(1, 'Brand is required')
      .max(100, 'Brand must be less than 100 characters'),
    model: z
      .string()
      .min(1, 'Model is required')
      .max(100, 'Model must be less than 100 characters'),
    yearFrom: z
      .number()
      .int('yearFrom must be an integer')
      .min(1900, 'yearFrom must be 1900 or later')
      .max(2100, 'yearFrom must be 2100 or earlier')
      .optional(),
    yearTo: z
      .number()
      .int('yearTo must be an integer')
      .min(1900, 'yearTo must be 1900 or later')
      .max(2100, 'yearTo must be 2100 or earlier')
      .optional(),
  })
  .refine(
    (dto) =>
      dto.yearFrom === undefined ||
      dto.yearTo === undefined ||
      dto.yearTo >= dto.yearFrom,
    { message: 'yearTo must be greater than or equal to yearFrom', path: ['yearTo'] },
  );

export const listMachinesQuerySchema = z.object({
  brand: z.string().trim().min(1).optional(),
  search: z.string().trim().min(1).optional(),
});

export type CreateMachineDto = z.infer<typeof createMachineSchema>;
export type ListMachinesQueryDto = z.infer<typeof listMachinesQuerySchema>;
