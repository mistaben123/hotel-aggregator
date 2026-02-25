import type { Datasource } from '@prisma/client/runtime/library'

// Minimal Prisma 7 config — move connection URL here for migrate & CLI
const config = {
  datasources: {
    db: {
      provider: 'postgresql',
      url: process.env.DATABASE_URL || ''
    } as unknown as Datasource
  }
}

export default config
