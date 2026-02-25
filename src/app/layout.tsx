import './globals.css'
import React from 'react'

export const metadata = {
  title: 'Hotel Aggregator Nigeria',
  description: 'Search and book hotels across Nigeria'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="bg-white shadow">
            <div className="container py-4 flex items-center justify-between">
              <h1 className="text-lg font-semibold">HotelAggregator NG</h1>
              <nav>
                <a className="mr-4 text-sm text-gray-700" href="/search">Search</a>
                <a className="text-sm text-gray-700" href="/account">Account</a>
              </nav>
            </div>
          </header>
          <main className="flex-1 container py-8">{children}</main>
          <footer className="bg-gray-50 py-6">
            <div className="container text-sm text-gray-600">© {new Date().getFullYear()} HotelAggregator NG</div>
          </footer>
        </div>
      </body>
    </html>
  )
}
