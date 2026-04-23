import { RequestHandler } from 'express';
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  logoutSchema,
} from '../schemas/auth.schema';
import * as authService from '../services/auth.service';

export const register: RequestHandler = async (req, res, next) => {
  try {
    const dto = registerSchema.parse(req.body);
    const result = await authService.register(dto);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const dto = loginSchema.parse(req.body);
    const result = await authService.login(dto);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const refresh: RequestHandler = async (req, res, next) => {
  try {
    const dto = refreshSchema.parse(req.body);
    const result = await authService.refresh(dto);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  try {
    const dto = logoutSchema.parse(req.body);
    await authService.logout(req.user!.id, dto);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
