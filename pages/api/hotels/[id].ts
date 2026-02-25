import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../src/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query
    if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Missing id' })

    const hotel = await prisma.hotel.findUnique({
      where: { id },
      include: { rooms: true, reviews: { include: { user: true } }, city: true }
    })

    if (!hotel) return res.status(404).json({ error: 'Hotel not found' })
    res.status(200).json(hotel)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}
