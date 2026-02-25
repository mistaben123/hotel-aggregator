import Link from 'next/link'

export default function Home() {
  return (
    <section>
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold">Find hotels across Nigeria</h2>
        <p className="mt-3 text-gray-600">Search Lagos, Abuja, Port Harcourt, Enugu, Owerri, Asaba and more.</p>
        <div className="mt-6">
          <Link href="/search" className="inline-block bg-blue-600 text-white px-5 py-3 rounded">Search hotels</Link>
        </div>
      </div>
    </section>
  )
}
