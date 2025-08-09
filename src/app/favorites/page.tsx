"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";

export default function FavoritesPage() {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("lef:favorites");
    try {
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed) && parsed.every((x) => typeof x === "string")) {
        setSlugs(parsed);
      } else {
        setSlugs([]);
      }
    } catch {
      setSlugs([]);
    }
  }, []);

  const { data: events, isLoading } = api.events.bySlugs.useQuery(
    { slugs },
    { enabled: slugs.length > 0 },
  );

  // Narrow any potential undefined entries defensively (tRPC typing + runtime safety)
  const safeEvents = (events ?? []).filter(
    (e): e is NonNullable<typeof e> => e !== undefined && e !== null,
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
        >
          ← Back to home
        </Link>
      </div>
      <h1 className="mb-6 text-2xl font-bold">Your Favorites</h1>
      {slugs.length === 0 ? (
        <p className="text-gray-600">No favorites yet.</p>
      ) : isLoading ? (
        <p className="text-gray-600">Loading…</p>
      ) : safeEvents.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {safeEvents.map((e) => (
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
      ) : (
        <p className="text-gray-600">No matching events found.</p>
      )}
    </main>
  );
}
