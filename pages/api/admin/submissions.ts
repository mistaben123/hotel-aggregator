import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../src/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session || !(session.user as any)?.role || (session.user as any).role !== 'ADMIN') return res.status(401).json({ error: 'Admin required' })

  try {
    if (req.method === 'GET') {
      const subs = await prisma.hotelSubmission.findMany({ orderBy: { createdAt: 'desc' } })
      return res.status(200).json(subs)
    }

    if (req.method === 'POST') {
      const { action, id } = req.body
      if (!action || !id) return res.status(400).json({ error: 'action and id required' })

      if (action === 'approve') {
        const sub = await prisma.hotelSubmission.findUnique({ where: { id } })
        if (!sub) return res.status(404).json({ error: 'Submission not found' })

        // create or find city
        let city = await prisma.city.findFirst({ where: { name: { equals: sub.cityName, mode: 'insensitive' } } })
        if (!city) city = await prisma.city.create({ data: { name: sub.cityName, state: sub.state } })

        // create hotel record
        const hotel = await prisma.hotel.create({
          data: {
            name: sub.name,
            description: sub.description,
            address: sub.address,
            cityId: city.id,
            latitude: sub.latitude,
            longitude: sub.longitude,
            powerAvailability: sub.powerAvailability || 'INTERMITTENT',
            securityRating: sub.securityRating || 3,
            phone: sub.phone,
            whatsapp: sub.whatsapp,
            photos: sub.photos || []
          }
        })

        await prisma.hotelSubmission.update({ where: { id }, data: { status: 'APPROVED' } })
        return res.status(200).json({ hotel })
      }

      if (action === 'reject') {
        await prisma.hotelSubmission.update({ where: { id }, data: { status: 'REJECTED' } })
        return res.status(200).json({ ok: true })
      }
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}
