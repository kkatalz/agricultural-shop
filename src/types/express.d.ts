import { Role } from '../lib/tokens';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: Role;
      };
    }
  }
}

export {};
