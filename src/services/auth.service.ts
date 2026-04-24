import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';
import { HttpError } from '../middleware/error';
import {
  Role,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../lib/tokens';
import {
  RegisterDto,
  LoginDto,
  RefreshDto,
  LogoutDto,
} from '../schemas/auth.schema';

async function issueTokens(userId: number, role: Role) {
  const accessToken = signAccessToken(userId, role);
  const { token: refreshToken, expiresAt } = signRefreshToken(userId);

  await prisma.refreshToken.create({
    data: { token: refreshToken, userId, expiresAt },
  });

  return { accessToken, refreshToken };
}

function publicUser(user: {
  id: number;
  email: string;
  name: string;
  role: string;
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export async function register(dto: RegisterDto) {
  const existing = await prisma.user.findUnique({
    where: { email: dto.email },
  });
  if (existing) throw new HttpError(409, 'Email already registered');

  const passwordHash = await bcrypt.hash(dto.password, 10);

  const user = await prisma.user.create({
    data: {
      email: dto.email,
      passwordHash,
      name: dto.name,
      phone: dto.phone,
      role: 'CUSTOMER',
    },
  });

  const tokens = await issueTokens(user.id, user.role as Role);

  return { user: publicUser(user), ...tokens };
}

export async function login(dto: LoginDto) {
  const user = await prisma.user.findUnique({ where: { email: dto.email } });
  if (!user) throw new HttpError(401, 'Invalid credentials');

  const ok = await bcrypt.compare(dto.password, user.passwordHash);
  if (!ok) throw new HttpError(401, 'Invalid credentials');

  const tokens = await issueTokens(user.id, user.role as Role);

  return { user: publicUser(user), ...tokens };
}

export async function refresh(dto: RefreshDto) {
  let userId: number;

  try {
    const payload = verifyRefreshToken(dto.refreshToken);

    userId = Number(payload.sub);
  } catch {
    throw new HttpError(401, 'Invalid or expired refresh token');
  }

  const stored = await prisma.refreshToken.findUnique({
    where: { token: dto.refreshToken },
  });

  if (
    !stored ||
    stored.revoked ||
    stored.expiresAt < new Date() ||
    stored.userId !== userId
  ) {
    throw new HttpError(401, 'Invalid or expired refresh token');
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  if (!user) throw new HttpError(401, 'User no longer exists');

  // revoke the old token, issue a new pair
  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revoked: true },
  });

  return issueTokens(user.id, user.role as Role);
}

export async function logout(userId: number, dto: LogoutDto) {
  await prisma.refreshToken.updateMany({
    where: { token: dto.refreshToken, userId, revoked: false },
    data: { revoked: true },
  });
}
