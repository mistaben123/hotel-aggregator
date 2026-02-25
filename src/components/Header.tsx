import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="container py-4 flex items-center justify-between">
        <Link href="/" style={{color:'var(--brand)'}}>HotelAggregator NG</Link>
        <nav>
          <Link href="/search" className="mr-4" style={{color:'var(--brand)'}}>Search</Link>
          <Link href="/account" style={{color:'var(--brand)'}}>Account</Link>
        </nav>
      </div>
    </header>
  )
}
