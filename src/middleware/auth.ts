import type { Request, Response, NextFunction } from 'express';
import { HttpError } from './error';
import { Role, verifyAccessToken } from '../lib/tokens';

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new HttpError(401, 'Missing or invalid Authorization header'));
  }
  const token = header.slice('Bearer '.length).trim();

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: Number(payload.sub), role: payload.role };
    next();
  } catch {
    next(new HttpError(401, 'Invalid or expired access token'));
  }
}

export function requireRole(...roles: Role[]) {
  return function (req: Request, _res: Response, next: NextFunction) {
    if (!req.user) return next(new HttpError(401, 'Not authenticated'));

    if (!roles.includes(req.user.role)) {
      return next(new HttpError(403, 'Forbidden'));
    }
    next();
  };
}
