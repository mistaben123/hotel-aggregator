import { PrismaClient, PowerAvailability } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create cities
  const lagos = await prisma.city.upsert({
    where: { name: 'Lagos' },
    update: {},
    create: { name: 'Lagos', state: 'Lagos' }
  })

  const abuja = await prisma.city.upsert({
    where: { name: 'Abuja' },
    update: {},
    create: { name: 'Abuja', state: 'FCT' }
  })

  // Create some amenities
  const wifi = await prisma.amenity.upsert({ where: { name: 'Wi-Fi' }, update: {}, create: { name: 'Wi-Fi' } })
  const ac = await prisma.amenity.upsert({ where: { name: 'AC' }, update: {}, create: { name: 'AC' } })
  const pool = await prisma.amenity.upsert({ where: { name: 'Swimming Pool' }, update: {}, create: { name: 'Swimming Pool' } })

  // Create sample hotels
  await prisma.hotel.createMany({
    data: [
      {
        name: 'Lekki Bay Hotel',
        description: 'Comfortable stay in Lekki with proximity to malls and beach.',
        address: 'Lekki Phase 1',
        cityId: lagos.id,
        latitude: 6.4281,
        longitude: 3.4215,
        powerAvailability: PowerAvailability.TWENTY_FOUR_SEVEN,
        securityRating: 4,
        phone: '+2348012345678',
        whatsapp: '+2348012345678'
      },
      {
        name: 'Garki Central Hotel',
        description: 'Business-friendly hotel near Abuja city center and airports.',
        address: 'Garki, Abuja',
        cityId: abuja.id,
        latitude: 9.0765,
        longitude: 7.3986,
        powerAvailability: PowerAvailability.GENERATOR,
        securityRating: 5,
        phone: '+2348098765432',
        whatsapp: '+2348098765432'
      }
    ]
  })

  // Create rooms for first hotel
  const hotels = await prisma.hotel.findMany()
  if (hotels.length > 0) {
    for (const hotel of hotels) {
      await prisma.room.createMany({
        data: [
          { hotelId: hotel.id, name: 'Standard', type: 'Standard', price: 20000, quantity: 10 },
          { hotelId: hotel.id, name: 'Deluxe', type: 'Deluxe', price: 40000, quantity: 5 }
        ]
      })
    }
  }

  console.log('Seed complete')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
