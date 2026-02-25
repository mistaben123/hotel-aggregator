"use client"
import React, { useState } from 'react'

type Room = { id: string; name: string; type: string; price: number; quantity: number }

export default function BookingForm({ hotelId, rooms }: { hotelId: string; rooms: Room[] }) {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [roomId, setRoomId] = useState(rooms?.[0]?.id || '')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  function daysBetween(a: string, b: string) {
    const d1 = new Date(a)
    const d2 = new Date(b)
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0
    const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 0
  }

  async function handleBooking(e: React.FormEvent) {
    e.preventDefault()
    if (!checkIn || !checkOut || !roomId || !email) return alert('Please fill all fields')
    setLoading(true)

    const room = rooms.find((r) => r.id === roomId) as Room
    const nights = daysBetween(checkIn, checkOut)
    const amount = room.price * nights

    try {
      // Create booking
      const createResp = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hotelId, roomId, checkIn, checkOut, amount })
      })
      const createData = await createResp.json()
      if (!createResp.ok) {
        if (createResp.status === 401) {
          // Not signed in
          window.location.assign('/api/auth/signin')
          return
        }
        throw new Error(createData.error || 'Failed to create booking')
      }

      const bookingId = createData.booking.id

      // Initiate Paystack
      const payResp = await fetch('/api/paystack/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, email })
      })
      const payData = await payResp.json()
      if (!payResp.ok) throw new Error(payData.error || 'Paystack init failed')

      // Redirect to Paystack authorization_url
      window.location.assign(payData.authorization_url)
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Booking failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleBooking} className="mt-6 p-4 border rounded">
      <h4 className="font-medium">Book a room</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
        <div>
          <label className="text-sm">Check-in</label>
          <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="mt-1 block w-full border rounded px-2 py-1" />
        </div>
        <div>
          <label className="text-sm">Check-out</label>
          <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="mt-1 block w-full border rounded px-2 py-1" />
        </div>
        <div>
          <label className="text-sm">Room</label>
          <select value={roomId} onChange={(e) => setRoomId(e.target.value)} className="mt-1 block w-full border rounded px-2 py-1">
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} — ₦{r.price.toLocaleString()} / night
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full border rounded px-2 py-1" placeholder="you@example.com" />
        </div>
      </div>

      <div className="mt-4">
        <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit" disabled={loading}>
          {loading ? 'Processing…' : 'Proceed to Paystack'}
        </button>
      </div>
    </form>
  )
}
