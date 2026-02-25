"use client"
import React from 'react'

export default function AdminSubmissions({ submissions }: { submissions: any[] }) {
  const approve = async (id: string) => {
    if (!confirm('Approve this submission and create hotel?')) return
    const res = await fetch('/api/admin/submissions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'approve', id }) })
    if (res.ok) location.reload()
    else alert('Failed to approve')
  }

  const reject = async (id: string) => {
    if (!confirm('Reject this submission?')) return
    const res = await fetch('/api/admin/submissions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'reject', id }) })
    if (res.ok) location.reload()
    else alert('Failed to reject')
  }

  return (
    <div className="space-y-3">
      {submissions.map((s) => (
        <div key={s.id} className="p-3 border rounded bg-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium">{s.name}</div>
              <div className="text-sm text-gray-600">{s.address} — {s.cityName}</div>
            </div>
            <div className="text-sm">{s.status}</div>
          </div>
          <div className="mt-2 text-sm text-gray-700">{s.description}</div>
          <div className="mt-3 flex gap-2">
            <button onClick={() => approve(s.id)} className="btn-brand px-3 py-1 rounded">Approve</button>
            <button onClick={() => reject(s.id)} className="px-3 py-1 border rounded">Reject</button>
          </div>
        </div>
      ))}
    </div>
  )
}
