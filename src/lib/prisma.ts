import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../generated/prisma/client';
import { env } from '../config/env';

const adapter = new PrismaLibSql({
  url: env.DATABASE_URL,
});

const client = new PrismaClient({ adapter });

export default client;
