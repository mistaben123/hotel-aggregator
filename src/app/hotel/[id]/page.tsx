import React from 'react'
import { prisma } from '../../../lib/prisma'
import BookingForm from '../../../components/BookingForm'

interface Props {
  params: { id: string }
}

export default async function HotelPage({ params }: Props) {
  const { id } = params

  const hotel = await prisma.hotel.findUnique({
    where: { id },
    include: { rooms: true, reviews: { include: { user: true } }, city: true }
  })

  if (!hotel) {
    return <div>Hotel not found</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold">{hotel.name}</h2>
      <p className="text-sm text-gray-600 mt-2">{hotel.address} — {hotel.city.name}</p>

      <div className="mt-4 grid md:grid-cols-2 gap-6">
        <section>
          <div className="space-y-3">
            <div>
              <h4 className="font-medium">About</h4>
              <p className="text-sm text-gray-600">{hotel.description}</p>
            </div>

            <div>
              <h4 className="font-medium">Rooms</h4>
              <ul className="mt-2 space-y-2">
                {hotel.rooms.map((r) => (
                  <li key={r.id} className="text-sm">{r.name} — ₦{r.price.toLocaleString()} / night</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <aside>
          {/* BookingForm is a client component */}
          <BookingForm hotelId={hotel.id} rooms={hotel.rooms} />
        </aside>
      </div>
    </div>
  )
}
