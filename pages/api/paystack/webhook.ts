import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../src/lib/prisma'
import crypto from 'crypto'

export const config = {
  api: {
    bodyParser: false
  }
}

async function getRawBody(req: NextApiRequest) {
  const chunks: Buffer[] = []
  for await (const chunk of req as any) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const secret = process.env.PAYSTACK_SECRET_KEY || ''
    const rawBody = await getRawBody(req)

    const signature = (req.headers['x-paystack-signature'] as string) || ''
    const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex')

    if (!signature || hash !== signature) {
      console.warn('Invalid Paystack signature')
      return res.status(400).json({ error: 'Invalid signature' })
    }

    const payload = JSON.parse(rawBody.toString())
    const event = payload.event

    // Handle relevant events with idempotent Payment recording
    if (event === 'charge.success' || event === 'charge.failed') {
      const reference = payload.data.reference
      const status = payload.data.status
      const amount = payload.data.amount // in kobo

      // Check if we've already recorded this payment
      const existingPayment = await prisma.payment.findUnique({ where: { reference } })
      if (existingPayment) {
        // If payment already exists and status unchanged, acknowledge
        if (existingPayment.status === status) {
          res.status(200).json({ received: true, note: 'Already processed' })
          return
        }
      }

      // Create or update payment record
      const paymentData: any = {
        reference,
        amount: Math.floor(Number(amount) || 0),
        currency: payload.data.currency || 'NGN',
        status,
        gateway: 'paystack',
        raw: payload.data
      }

      if (existingPayment) {
        await prisma.payment.update({ where: { reference }, data: paymentData })
      } else {
        await prisma.payment.create({ data: paymentData })
      }

      // Attempt to find booking by id (we use booking.id as reference) or by paystackRef
      let booking = await prisma.booking.findUnique({ where: { id: reference } })
      if (!booking) booking = await prisma.booking.findFirst({ where: { paystackRef: reference } })

      if (booking) {
        if (status === 'success') {
          if (booking.status !== 'CONFIRMED') {
            await prisma.booking.update({ where: { id: booking.id }, data: { status: 'CONFIRMED', paystackRef: reference } })
          }
        } else {
          await prisma.booking.update({ where: { id: booking.id }, data: { status: 'FAILED', paystackRef: reference } })
        }
      }
    }

    // Always respond 200 quickly to acknowledge webhook
    res.status(200).json({ received: true })
  } catch (err) {
    console.error('Webhook error', err)
    res.status(500).json({ error: 'Webhook handler error' })
  }
}
