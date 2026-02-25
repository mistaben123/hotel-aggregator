import React from 'react'
import Link from 'next/link'

export default function SearchPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Search hotels</h3>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <aside className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700">City</label>
            <input className="mt-1 block w-full border rounded px-3 py-2" placeholder="Lagos, Abuja..." />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Price range (₦)</label>
            <input className="mt-1 block w-full border rounded px-3 py-2" placeholder="e.g. 10000-40000" />
          </div>
        </aside>

        <div className="md:col-span-2">
          <div className="grid gap-4">
            <div className="p-4 border rounded">
              <h4 className="font-medium">Sample Hotel</h4>
              <p className="text-sm text-gray-600">Lekki Bay Hotel — Lekki Phase 1</p>
              <div className="mt-2">
                <Link href="/hotel/sample-id" className="text-blue-600">View details</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
