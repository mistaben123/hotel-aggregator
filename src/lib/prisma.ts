import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const adapter: any = process.env.DATABASE_URL ? { url: process.env.DATABASE_URL } : undefined

export const prisma = global.prisma || new PrismaClient(adapter ? { adapter } : undefined)

if (process.env.NODE_ENV !== 'production') global.prisma = prisma
