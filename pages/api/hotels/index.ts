import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../src/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { q, city, minPrice, maxPrice } = req.query

    const where: any = {}
    if (city) where['city'] = { name: { contains: String(city), mode: 'insensitive' } }
    if (q) where['name'] = { contains: String(q), mode: 'insensitive' }

    // Basic hotel fetch; filtering by price requires joining rooms
    const hotels = await prisma.hotel.findMany({
      where,
      include: { city: true, rooms: true }
    })

    // If price filters present, filter in memory for now
    let filtered = hotels
    if (minPrice || maxPrice) {
      const min = minPrice ? parseInt(String(minPrice), 10) : 0
      const max = maxPrice ? parseInt(String(maxPrice), 10) : Number.MAX_SAFE_INTEGER
      filtered = hotels.filter((h) => h.rooms.some((r) => r.price >= min && r.price <= max))
    }

    res.status(200).json(filtered)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}
