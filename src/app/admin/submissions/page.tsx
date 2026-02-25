import React from 'react'
import { prisma } from '../../../../src/lib/prisma'
import AdminSubmissions from '../../../../components/AdminSubmissions'

export default async function AdminPage() {
  const subs = await prisma.hotelSubmission.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div>
      <h2 className="text-2xl font-semibold">Admin — Hotel Submissions</h2>
      <p className="text-sm text-gray-600 mt-2">Review and approve hotel submissions from owners.</p>
      <div className="mt-4">
        {/* AdminSubmissions is a client component that calls protected API endpoints */}
        {/* Note: ensure the current user is ADMIN to access the API */}
        {/* Submissions passed as initial props for display */}
        {/* @ts-expect-error Server Component passing JSON */}
        <AdminSubmissions submissions={subs} />
      </div>
    </div>
  )
}
