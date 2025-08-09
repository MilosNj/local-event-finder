import { api, HydrateClient } from "~/trpc/server";
import InfiniteEventsList from "../components/InfiniteEventsList";

export default async function Home() {
  // Prefetch first page of infinite list
  void api.events.listInfinite.prefetch({ limit: 12 });
  const first = await api.events.listInfinite({ limit: 12 });

  return (
    <HydrateClient>
      <main className="min-h-screen bg-gray-50 text-gray-900">
        <section className="mx-auto max-w-5xl px-4 py-10">
          <h1 className="mb-6 text-3xl font-bold">Local Event Finder</h1>
          <p className="mb-8 text-gray-600">
            Discover concerts, meetups, and festivals near you.
          </p>
          {first.items.length === 0 ? (
            <div className="rounded-md border bg-white p-6 text-center text-gray-600">
              No events found. Make sure the database is seeded (see README) and
              reload.
            </div>
          ) : (
            <InfiniteEventsList />
          )}
        </section>
      </main>
    </HydrateClient>
  );
}
