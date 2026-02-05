// This will be used by the services. 
// In a real Electron app, this might communicate via IPC, but for this refactor we assume direct access 
// or that this file is part of the 'backend' logic running in the main process or permitted renderer environment.

import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = db;
