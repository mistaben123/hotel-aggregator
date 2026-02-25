import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../src/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const session = await getServerSession(req, res, authOptions)
  if (!session || !session.user) return res.status(401).json({ error: 'Authentication required' })

  try {
    const { hotelId, roomId, checkIn, checkOut, amount } = req.body

    const booking = await prisma.booking.create({
      data: {
        userId: (session.user as any).id,
        hotelId,
        roomId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        totalAmount: parseInt(amount, 10),
        currency: 'NGN',
        status: 'PENDING'
      }
    })

    res.status(200).json({ booking })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create booking' })
  }
}
