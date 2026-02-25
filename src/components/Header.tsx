import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="container py-4 flex items-center justify-between">
        <Link href="/">HotelAggregator NG</Link>
        <nav>
          <Link href="/search" className="mr-4">Search</Link>
          <Link href="/account">Account</Link>
        </nav>
      </div>
    </header>
  )
}
