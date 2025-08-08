import { notFound } from "next/navigation";
import Link from "next/link";
import { HydrateClient, api } from "~/trpc/server";

export default async function CityEventsPage({
  params,
}: {
  params: { city: string };
}) {
  const city = decodeURIComponent(params.city);
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
              className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md"
            >
              <h3 className="font-semibold">{e.title}</h3>
              <p className="text-sm text-gray-500">{e.city}</p>
            </Link>
          ))}
        </div>
      </main>
    </HydrateClient>
  );
}
