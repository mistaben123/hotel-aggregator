# Hotel Aggregator NG

Modern hotel aggregation starter app focused on Nigeria.

Tech stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- NextAuth (Email + Google)
- Paystack (integration example)

Quick start

1. Copy .env.example to `.env` and fill values (Postgres, NextAuth, Paystack, Google Maps keys)

2. Install dependencies

```bash
npm install
```

3. Generate Prisma client and migrate (Prisma 7)

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

Notes: Prisma 7 uses `prisma.config.ts` for datasource configuration — ensure `DATABASE_URL` is set in `.env` before running migrations.

4. Run dev server

```bash
npm run dev
```

What I scaffolded
- Project configuration (Next, TypeScript, Tailwind)
- Prisma schema: User, City, Hotel, Room, Booking, Review, Amenity
- Seed script `prisma/seed.ts` with sample cities and hotels
- Basic app router pages: `/`, `/search`, `/hotel/[id]`
- API routes: `pages/api/hotels`, `pages/api/bookings/create`, NextAuth config
- Paystack integration: example flow placeholder in bookings route

Next steps (suggested)
- Implement full booking -> Paystack transaction initiation and verification
- Finish frontend: search results, hotel detail, booking flow, account pages
- Admin dashboard pages and secure API endpoints
- Add tests and CI configuration

Paystack webhook

- Endpoint: `POST /api/paystack/webhook`
- Configure Paystack to send webhooks to your production URL: `https://your-domain.com/api/paystack/webhook`
- Set `PAYSTACK_SECRET_KEY` in your environment; the handler verifies the `x-paystack-signature` header using HMAC SHA-512.
- The webhook updates a booking whose `id` matches Paystack `data.reference` and marks it `CONFIRMED` or `FAILED`.

Idempotency and `Payment` records

- A `Payment` model is added to `prisma/schema.prisma` to store incoming transactions and enforce idempotent processing.
- The webhook checks for an existing `Payment` by `reference` and skips duplicate processing when the status hasn't changed.
- On first receipt, the webhook creates a `Payment` record and updates the corresponding `Booking` status.

Notes
- For local development you can use a tunnel (ngrok) and set the webhook URL in your Paystack dashboard.
- Ensure your webhook endpoint is reachable over HTTPS in production.
