import { PrismaClient } from '@prisma/client';
import { config } from './env';

let prisma: PrismaClient;

declare global {
  // eslint-disable-next-line no-var
  var __db__: PrismaClient;
}

if (config.environment === 'production') {
  prisma = getClient();
} else {
  if (!global.__db__) {
    global.__db__ = getClient();
  }
  prisma = global.__db__;
}

function getClient() {
  const db = config.db;

  const client = new PrismaClient({
    datasources: {
      db: {
        url: db,
      },
    },
  });
  client.$connect();
  return client;
}

export { prisma };
