import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

/** Categories we support */
const categories = [
  "Music",
  "Tech",
  "Food",
  "Film",
  "Art",
  "Sports",
  "Theatre",
];

const cities = [
  "Belgrade",
  "Novi Sad",
  "Niš",
  "Kragujevac",
  "Subotica",
  "Čačak",
  "Zrenjanin",
];

// A small curated list of royalty-free / promo images
const imagePool = [
  "https://images.unsplash.com/photo-1518976024611-28bf4b37f73d?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1504805572947-34fad45aed93?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1505238680356-667803448bb6?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=60",
];

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 70);
}

async function main() {
  console.log("🌱 Seeding database...");

  // Wipe existing
  await prisma.event.deleteMany();
  await prisma.venue.deleteMany();

  const venueCount = 25;
  const eventsPerVenueMin = 2;
  const eventsPerVenueMax = 8;

  const venues: { id: number; name: string; city: string }[] = [];

  for (let i = 0; i < venueCount; i++) {
    const city = faker.helpers.arrayElement(cities);
    const name = faker.company.name() + " " + faker.word.sample({ length: 1 });

    const v = await prisma.venue.create({
      data: {
        name,
        city,
        address: faker.location.streetAddress(),
      },
      select: { id: true, name: true, city: true },
    });
    venues.push(v);
  }

  let totalEvents = 0;
  for (const venue of venues) {
    const n = faker.number.int({
      min: eventsPerVenueMin,
      max: eventsPerVenueMax,
    });
    for (let j = 0; j < n; j++) {
      const category = faker.helpers.arrayElement(categories);
      const title =
        faker.commerce.productAdjective() + " " + category + " Event";
      const base = faker.date.between({
        from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
        to: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
      });
      const durationHours = faker.number.int({ min: 2, max: 8 });
      const startsAt = base;
      const endsAt = new Date(base.getTime() + durationHours * 60 * 60 * 1000);

      const slugBase = slugify(`${venue.city}-${title}-${venue.id}-${j}`);

      await prisma.event.create({
        data: {
          title,
          slug: slugBase,
          description: faker.lorem.sentences({ min: 1, max: 3 }),
          category,
          city: venue.city,
          imageUrl: faker.helpers.arrayElement(imagePool),
          startsAt,
          endsAt,
          venueId: venue.id,
        },
      });
      totalEvents++;
    }
  }

  console.log(
    `✅ Seed complete: ${venues.length} venues, ${totalEvents} events.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
