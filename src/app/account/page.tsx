import React from 'react'
import { prisma } from '../../lib/prisma'

export default async function AccountPage({ searchParams }: { searchParams?: any }) {
  // For demo: accept ?userId=... to fetch bookings
  const userId = searchParams?.userId || null

  if (!userId) {
    return (
      <div>
        <h2 className="text-2xl font-semibold">Account</h2>
        <p className="mt-2 text-sm text-gray-600">To view your bookings locally add <strong>?userId=YOUR_USER_ID</strong> to the URL.</p>
      </div>
    )
  }

  const bookings = await prisma.booking.findMany({ where: { userId }, include: { hotel: true, room: true } })

  return (
    <div>
      <h2 className="text-2xl font-semibold">My Bookings</h2>
      <div className="mt-4 space-y-4">
        {bookings.length === 0 && <div className="text-sm text-gray-600">No bookings found.</div>}
        {bookings.map((b) => (
          <div key={b.id} className="p-3 border rounded">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{b.hotel.name}</div>
                <div className="text-sm text-gray-600">{b.room.name} — {b.checkIn.toISOString().slice(0,10)} to {b.checkOut.toISOString().slice(0,10)}</div>
              </div>
              <div className="text-sm">{b.currency} {b.totalAmount.toLocaleString()}</div>
            </div>
            <div className="mt-2 text-xs text-gray-600">Status: {b.status}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
