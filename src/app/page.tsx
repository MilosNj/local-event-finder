import Link from "next/link";

import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  // Prefetch a few demo events
  void api.events.list.prefetch({ limit: 6 });
  const events = await api.events.list({ limit: 6 });

  return (
    <HydrateClient>
      <main className="min-h-screen bg-gray-50 text-gray-900">
        <section className="mx-auto max-w-5xl px-4 py-10">
          <h1 className="mb-6 text-3xl font-bold">Local Event Finder</h1>
          <p className="mb-8 text-gray-600">
            Discover concerts, meetups, and festivals near you.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => (
              <Link
                key={e.id}
                href={`/events/${encodeURIComponent(e.city.toLowerCase())}/${e.slug}`}
                className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md"
              >
                <h3 className="font-semibold">{e.title}</h3>
                <p className="text-sm text-gray-500">{e.city}</p>
              </Link>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/favorites"
              className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800"
            >
              View Favorites
            </Link>
          </div>
        </section>
      </main>
    </HydrateClient>
  );
}
