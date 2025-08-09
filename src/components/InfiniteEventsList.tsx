"use client";

import Link from "next/link";
import { api } from "~/trpc/react";

function formatDate(dt: Date | string) {
  const d = typeof dt === "string" ? new Date(dt) : dt;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function InfiniteEventsList({
  initialCity,
}: {
  initialCity?: string;
}) {
  const limit = 12;
  const query = api.events.listInfinite.useInfiniteQuery(
    { city: initialCity, limit },
    {
      getNextPageParam: (last) => last.nextCursor,
    },
  );

  const events = query.data?.pages.flatMap((p) => p.items) ?? [];
  const hasMore = !!query.data?.pages.at(-1)?.nextCursor;

  return (
    <div>
      {events.length === 0 && query.isLoading && (
        <div className="rounded-md border bg-white p-6 text-center text-gray-600">
          Loading events...
        </div>
      )}
      {events.length > 0 && (
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
      )}
      <div className="mt-8 flex justify-center">
        {hasMore ? (
          <button
            onClick={() => query.fetchNextPage()}
            disabled={query.isFetchingNextPage}
            className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {query.isFetchingNextPage ? "Loading..." : "Load More"}
          </button>
        ) : (
          events.length > 0 && (
            <span className="text-sm text-gray-500">No more events.</span>
          )
        )}
      </div>
    </div>
  );
}
