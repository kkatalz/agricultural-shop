import type { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import type {
  RegisterDto,
  LoginDto,
  RefreshDto,
  LogoutDto,
} from '../schemas/auth.schema';

export async function register(
  req: Request<{}, {}, RegisterDto>,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function login(
  req: Request<{}, {}, LoginDto>,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function refresh(
  req: Request<{}, {}, RefreshDto>,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await authService.refresh(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function logout(
  req: Request<{}, {}, LogoutDto>,
  res: Response,
  next: NextFunction,
) {
  try {
    await authService.logout(req.user!.id, req.body);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
