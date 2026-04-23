import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env';

export type Role = 'ADMIN' | 'CUSTOMER';

export interface AccessTokenPayload extends JwtPayload {
  sub: string;
  role: Role;
}

export interface RefreshTokenPayload extends JwtPayload {
  sub: string;
}

type Expires = SignOptions['expiresIn'];

export function signAccessToken(userId: number, role: Role): string {
  return jwt.sign({ role }, env.JWT_ACCESS_SECRET, {
    subject: String(userId),
    expiresIn: env.JWT_ACCESS_TTL as Expires,
  });
}

export function signRefreshToken(userId: number): {
  token: string;
  expiresAt: Date;
} {
  const token = jwt.sign({}, env.JWT_REFRESH_SECRET, {
    subject: String(userId),
    expiresIn: env.JWT_REFRESH_TTL as Expires,
  });

  const decoded = jwt.decode(token) as JwtPayload | null;
  const expSeconds =
    decoded?.exp ?? Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30;

  return { token, expiresAt: new Date(expSeconds * 1000) };
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);

  if (typeof decoded === 'string' || !decoded.sub) {
    throw new Error('Invalid access token payload');
  }

  return decoded as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);

  if (typeof decoded === 'string' || !decoded.sub) {
    throw new Error('Invalid refresh token payload');
  }

  return decoded as RefreshTokenPayload;
}
