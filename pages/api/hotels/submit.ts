import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../src/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const data = req.body
    const required = ['name', 'address', 'cityName', 'state']
    for (const k of required) if (!data[k]) return res.status(400).json({ error: `${k} is required` })

    const submission = await prisma.hotelSubmission.create({
      data: {
        name: data.name,
        description: data.description || null,
        address: data.address,
        cityName: data.cityName,
        state: data.state,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        phone: data.phone || null,
        whatsapp: data.whatsapp || null,
        contactEmail: data.contactEmail || null,
        website: data.website || null,
        photos: data.photos || [],
        amenities: data.amenities || [],
        powerAvailability: data.powerAvailability || null,
        securityRating: data.securityRating || null,
        ownerName: data.ownerName || null,
        ownerPhone: data.ownerPhone || null
      }
    })

    res.status(201).json({ submission })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create submission' })
  }
}
