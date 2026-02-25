import React from 'react'

export default function ConfirmationPage({ searchParams }: { searchParams?: any }) {
  const bookingId = searchParams?.bookingId
  const status = searchParams?.status || 'unknown'

  return (
    <div>
      <h2 className="text-2xl font-semibold">Booking Confirmation</h2>
      <p className="mt-3 text-sm text-gray-700">Booking ID: {bookingId}</p>
      <p className="mt-2 text-sm">Status: {status}</p>
      <div className="mt-4">
        <a href="/account" className="text-blue-600">Go to account</a>
      </div>
    </div>
  )
}
