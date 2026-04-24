import type { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export function validate(schema: ZodSchema) {
  return function (req: Request, res: Response, next: NextFunction) {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: 'Validation error',
        details: result.error.issues.map(function (issue) {
          return {
            field: issue.path.join('.'),
            message: issue.message,
          };
        }),
      });
    }

    req.body = result.data;
    next();
  };
}
