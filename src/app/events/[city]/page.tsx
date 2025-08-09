import { notFound } from "next/navigation";
import Link from "next/link";
import { HydrateClient, api } from "~/trpc/server";

function formatDate(dt: Date | string) {
  const d = typeof dt === "string" ? new Date(dt) : dt;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function CityEventsPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: cityParam } = await params;
  const city = decodeURIComponent(cityParam);
  void api.events.list.prefetch({ city });
  const events = await api.events.list({ city, limit: 30 });

  if (!events) notFound();

  return (
    <HydrateClient>
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-6 text-2xl font-bold">Events in {city}</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <Link
              key={e.id}
              href={`/events/${encodeURIComponent(city.toLowerCase())}/${e.slug}`}
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
      </main>
    </HydrateClient>
  );
}
