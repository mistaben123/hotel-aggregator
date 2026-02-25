import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../src/lib/prisma'

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || ''

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { reference, bookingId } = req.query
    const ref = String(reference || '')
    const bId = String(bookingId || '')

    if (!ref) return res.status(400).send('Missing reference')

    const resp = await fetch(`https://api.paystack.co/transaction/verify/${ref}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` }
    })
    const data = await resp.json()

    if (!data.status) {
      // mark booking failed if bookingId present
      if (bId) await prisma.booking.update({ where: { id: bId }, data: { status: 'FAILED' } })
      return res.status(400).json({ error: 'Payment verification failed', details: data })
    }

    // Update booking status to CONFIRMED
    const referenceFromPaystack = data.data.reference
    // Find booking by id (prefer bookingId param) else by reference
    let booking = null
    if (bId) booking = await prisma.booking.update({ where: { id: bId }, data: { status: 'CONFIRMED', paystackRef: referenceFromPaystack } })
    else booking = await prisma.booking.updateMany({ where: { paystackRef: referenceFromPaystack }, data: { status: 'CONFIRMED' } })

    // Redirect to a confirmation page on the frontend
    const redirectUrl = `${process.env.NEXTAUTH_URL}/booking/confirmation?bookingId=${bId || referenceFromPaystack}&status=success`
    return res.redirect(302, redirectUrl)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}
