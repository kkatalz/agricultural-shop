import { z } from 'zod';

export const createCompatibilitySchema = z.object({
  partId: z
    .number()
    .int('Part id must be an integer')
    .positive('Part id must be positive'),
  machineId: z
    .number()
    .int('Machine id must be an integer')
    .positive('Machine id must be positive'),
  note: z
    .string()
    .max(200, 'Note must be less than 200 characters')
    .optional(),
});

export const updateCompatibilitySchema = z.object({
  note: z
    .string()
    .max(200, 'Note must be less than 200 characters')
    .nullable()
    .optional(),
});

export const listCompatibilitiesQuerySchema = z.object({
  partId: z.coerce.number().int().positive().optional(),
  machineId: z.coerce.number().int().positive().optional(),
});

export type CreateCompatibilityDto = z.infer<typeof createCompatibilitySchema>;
export type UpdateCompatibilityDto = z.infer<typeof updateCompatibilitySchema>;
export type ListCompatibilitiesQueryDto = z.infer<
  typeof listCompatibilitiesQuerySchema
>;
