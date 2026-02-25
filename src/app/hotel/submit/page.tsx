"use client"
import React, { useState } from 'react'

export default function HotelSubmitPage() {
  const [form, setForm] = useState({ name: '', address: '', cityName: '', state: '', phone: '', contactEmail: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  function onChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: any) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch('/api/hotels/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setMessage('Submission received. Admin will review and approve.')
      setForm({ name: '', address: '', cityName: '', state: '', phone: '', contactEmail: '', description: '' })
    } catch (err: any) {
      setMessage(err.message || 'Submission failed')
    } finally { setLoading(false) }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold">List your hotel</h2>
      <p className="text-sm text-gray-600 mt-2">Fill the form below and our admin will review your listing.</p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3 max-w-2xl">
        <div>
          <label className="block text-sm">Hotel name</label>
          <input name="name" value={form.name} onChange={onChange} className="mt-1 block w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm">Address</label>
          <input name="address" value={form.address} onChange={onChange} className="mt-1 block w-full border rounded px-3 py-2" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm">City</label>
            <input name="cityName" value={form.cityName} onChange={onChange} className="mt-1 block w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm">State</label>
            <input name="state" value={form.state} onChange={onChange} className="mt-1 block w-full border rounded px-3 py-2" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm">Phone</label>
            <input name="phone" value={form.phone} onChange={onChange} className="mt-1 block w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm">Contact email</label>
            <input name="contactEmail" value={form.contactEmail} onChange={onChange} className="mt-1 block w-full border rounded px-3 py-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm">Description</label>
          <textarea name="description" value={form.description} onChange={onChange} className="mt-1 block w-full border rounded px-3 py-2" rows={4} />
        </div>

        <div>
          <button disabled={loading} className="btn-brand px-4 py-2 rounded">{loading ? 'Submitting…' : 'Submit for review'}</button>
        </div>
        {message && <div className="text-sm mt-2">{message}</div>}
      </form>
    </div>
  )
}
