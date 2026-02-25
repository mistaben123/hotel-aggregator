import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '../../../src/lib/prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as any),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT || 587),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM || 'no-reply@example.com'
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'database'
  },
  callbacks: {
    async session({ session, user }) {
      // attach user id and role to session
      if (session.user) {
        session.user.id = (user as any).id
        session.user.role = (user as any).role
      }
      return session
    }
  }
}

export default NextAuth(authOptions)
