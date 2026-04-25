import type { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import { HttpError } from './error';

export function validate(schema: ZodSchema) {
  return function (req: Request, _res: Response, next: NextFunction) {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };
}

export function parseId(value: string, name = 'id'): number {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, `Invalid ${name}`);
  }
  return id;
}
