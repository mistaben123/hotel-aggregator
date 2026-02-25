import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../src/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions)
    if (!session || !session.user) return res.status(401).json({ error: 'Authentication required' })

    const userId = (session.user as any).id

    const bookings = await prisma.booking.findMany({ where: { userId: String(userId) }, include: { hotel: true, room: true } })
    res.status(200).json(bookings)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}
