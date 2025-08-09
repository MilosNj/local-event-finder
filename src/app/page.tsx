import Link from "next/link";
import { api, HydrateClient } from "~/trpc/server";

function formatDate(dt: Date | string) {
  const d = typeof dt === "string" ? new Date(dt) : dt;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

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
                className="group overflow-hidden rounded-lg border bg-white shadow-sm hover:shadow-md"
              >
                {e.imageUrl && (
                  <div className="h-40 w-full overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={e.imageUrl}
                      alt={e.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="mb-1 line-clamp-1 font-semibold">{e.title}</h3>
                  <p className="text-xs text-gray-500">
                    <span>{e.city}</span>
                    {" • "}
                    <span>{formatDate(e.startsAt)}</span>
                  </p>
                </div>
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
