import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../src/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]'

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || ''

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const session = await getServerSession(req, res, authOptions)
  if (!session || !session.user) return res.status(401).json({ error: 'Authentication required' })

  try {
    const { bookingId, email } = req.body
    if (!bookingId || !email) return res.status(400).json({ error: 'bookingId and email required' })

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } })
    if (!booking) return res.status(404).json({ error: 'Booking not found' })

    // Ensure the current user owns the booking or is admin
    const currentUserId = (session.user as any).id
    const currentRole = (session.user as any).role
    if (booking.userId !== currentUserId && currentRole !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' })

    const amountKobo = booking.totalAmount * 100

    const body = {
      email,
      amount: amountKobo,
      reference: booking.id,
      callback_url: `${process.env.NEXTAUTH_URL}/api/paystack/verify?bookingId=${booking.id}`
    }

    const resp = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const data = await resp.json()
    if (!data.status) return res.status(500).json({ error: 'Paystack initialization failed', details: data })

    // Save reference returned by paystack (optional)
    await prisma.booking.update({ where: { id: booking.id }, data: { paystackRef: data.data.reference } })

    res.status(200).json({ authorization_url: data.data.authorization_url, reference: data.data.reference })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}
